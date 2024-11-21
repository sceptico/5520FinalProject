import { Button, Text, TextInput, View, TouchableOpacity } from 'react-native'
import React, { useState, useLayoutEffect } from 'react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { globalStyles } from '../Style/Styles'
import { FontAwesome5 } from '@expo/vector-icons'
import Color from '../Style/Color'

export default function Login({navigation}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const auth = getAuth()

  // Use useLayoutEffect to set navigation options
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Main Tabs')}
          style={{ marginLeft: 15 }}
        >
       <FontAwesome5 name="arrow-left" size={24} color= {Color.tradeLogo}/>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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
