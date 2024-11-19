import { TextInput, Text, View, Button, Alert } from 'react-native'
import { useState } from 'react'
import React from 'react'
import { db } from '../Firebase/firebaseSetup'
import { doc, setDoc } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { globalStyles } from '../Style/Styles'

export default function Signup({navigation}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const auth = getAuth()

  const emailHandler = (text) => {
    setEmail(text)
  }

  const passwordHandler = (text) => {
    setPassword(text)
  }

  const confirmPasswordHandler = (text) => {
    setConfirmPassword(text)
  }

  const registerHandler = async () => {
    try {
      if (password !== confirmPassword) {
        Alert.alert('Passwords do not match')
        return
      }
      if (email.length ===0 || password.length === 0 || confirmPassword.length === 0) {
        Alert.alert('Please fill in all fields')
        return
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        Alert.alert('Please enter a valid email address')
        return
      }
      const userCred = 
      await createUserWithEmailAndPassword(auth, email, password)
      console.log('userCred', userCred)
      await writeUserDataToFirestore(userCred.user.uid, userCred.user.email)
    } catch(err) {
      if(err.code === "auth/weak-password") {
        Alert.alert('Password is too weak')
        return
      }
      Alert.alert(err.message)
    }
  }
  const writeUserDataToFirestore = async (userId, email) => {
    try {
      // Create a reference to the 'users' collection and set user data
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, {
        email: email,
        uid: userId,
        likedProducts: [] // Initialize liked products array
      });

      console.log('User data written to Firestore');
    } catch (error) {
      console.error('Error writing user data to Firestore:', error);
    }
  };

  const loginHandler=() => {
    navigation.replace('Login')
  }
  return (
    <View>
      <Text style={globalStyles.buttonText}>Email Address</Text>
      <TextInput style={globalStyles.input} placeholder='Email' onChangeText={emailHandler}/>
      <Text style={globalStyles.buttonText}>Password</Text>
      <TextInput style={globalStyles.input} placeholder='Password' 
      onChangeText={passwordHandler}
      secureTextEntry={true}/>
      <Text style={globalStyles.buttonText}>Confirm Password</Text>
      <TextInput style={globalStyles.input} placeholder='Password' 
      onChangeText={confirmPasswordHandler}
      secureTextEntry={true}/>
      <View>
        <Button title='Register' onPress={registerHandler}/>
        <Button title='Already Registered? Login' onPress={loginHandler}/>
        </View>
    </View>
  )
}