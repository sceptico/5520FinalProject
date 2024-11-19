import { Button, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { globalStyles } from '../Style/Styles'

export default function Login({navigation}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const auth = getAuth()
  const emailHandler = (text) => {
    setEmail(text)
  }
  const passwordHandler = (text) => {
    setPassword(text)
  }
  const signupHandler = () => {
    navigation.replace('Signup')
  }
  const loginHandler = async () => {
    try {
      if (email.length ===0 || password.length === 0) {
        Alert.alert('Please fill in all fields')
        return
      }
      const userCred = await signInWithEmailAndPassword(auth, email, password)
      console.log('user', userCred.user)
  } catch(err) {
    Alert.alert(err.message)
  }
  }

  return (
    <View>
      <Text style={globalStyles.buttonText}>Email Address</Text>
      <TextInput style={globalStyles.input} placeholder='Email' onChangeText={emailHandler}/>
      <Text style={globalStyles.buttonText}>Password</Text>
      <TextInput style={globalStyles.input} placeholder='Password' onChangeText={passwordHandler}/>
      <View>
        <Button title='Login' onPress={loginHandler}/>
        <Button title='New User? Create an account' onPress={signupHandler}/>
        </View>
    </View>
  )
}
