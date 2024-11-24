import { Button, Text, TextInput, View, TouchableOpacity,Alert } from 'react-native'
import React, { useState, useLayoutEffect } from 'react'
import { getAuth, signInWithEmailAndPassword,GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth'
import { globalStyles } from '../Style/Styles'
import { FontAwesome5 } from '@expo/vector-icons'
import Color from '../Style/Color'
import { auth } from '../Firebase/firebaseSetup'


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

  const loginWithEmail = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in:', userCredential.user);
      
      Alert.alert('Welcome Back!');
      navigation.navigate('Main Tabs', { screen: 'My Account' });



    } catch (error) {
      Alert.alert('Login Error', "Your email or password is incorrect");
    }
  };


  return (
    <View style={globalStyles.authPage}>
      <View style={globalStyles.inputContainer}>
        <TextInput
          style={globalStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={globalStyles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <Button title="Login" onPress={loginWithEmail} />
      <Text style={globalStyles.authText}>Don't have an account?</Text> 
      <Button title="Sign Up" onPress={() => navigation.replace('Signup')} />
      <View style={globalStyles.inputContainer}>
        {/* <Button title="Log in with Google" onPress={loginWithGoogle} />
        <Button title="Log in with Facebook" onPress={loginWithFacebook} /> */}
      </View>
    </View>
  );
}