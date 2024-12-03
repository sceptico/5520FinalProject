import { Button, Text, View, TextInput } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { auth, db } from '../Firebase/firebaseSetup'
import {updateDocument} from '../Firebase/firebaseHelper'
import { globalStyles } from '../Style/Styles'
import LocationManager from '../Component/LocationManager'

export default function EditProfile({navigation, route}) {
  const user = route.params.user
  console.log(route.params)
  
  const [uid, setUid] = useState('')
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [phone, setPhone] = useState('')
  const [photoURL, setPhotoURL] = useState('')
  const [DOB, setDOB] = useState('')
  const [golfYears, setGolfYears] = useState('')

  useEffect(() => {
    // const { uid, email, name, phone, imageURL } = route.params
    setUid(user.uid)
    setEmail(user.email)
    setUserName(user.userName)
    setPhone(user.phone)
    setPhotoURL(user.photoURL)
  }
  , [route.params])

  // const updateProfile = async () => {
  //   try {
  //     const updatedData = {}
  //     if (userName !== user.userName) updatedData.userName = userName
  //     if (phone !== user.phone) updatedData.phone = phone

  //     // Only update fields if they were changed
  //     if (Object.keys(updatedData).length > 0) {
  //       await updateDocument('users', uid, updatedData)
  //       console.log('Profile updated successfully')
  //     } else {
  //       console.log('No changes made')
  //     }
  //     navigation.goBack()
  //   } catch (error) {
  //     console.error('Error updating profile:', error)
  //   }
  // }

  const handleUserNameChange = (text) => {
    setUserName(text)
  }

  const updateProfile = async () => {
    try {
      const updatedData = {};
      if (userName !== user.userName) updatedData.userName = userName;
      if (phone !== user.phone) updatedData.phone = phone;
  
      if (Object.keys(updatedData).length > 0) {
        await updateDocument("users", uid, updatedData);
        console.log("Profile updated successfully");
        navigation.goBack({ updatedUser: { ...user, ...updatedData } });
      } else {
        console.log("No changes made");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  

  const handlePhoneChange = (number) => {
    setPhone(number)
  }

  return (
    <View style={globalStyles.formContainer}>
      <Text style={globalStyles.authText}>Email: {email}</Text>

      {/* Name input field */}
      <Text style={globalStyles.authText}>User Name:</Text>
      <TextInput
        style={globalStyles.input}
        value={userName}
        onChangeText={handleUserNameChange}
        placeholder="Enter new name"
      />

      {/* Phone input field */}
      <Text style={globalStyles.authText}>Phone Number:</Text>
      <TextInput
        style={globalStyles.input}
        value={phone}
        onChangeText={handlePhoneChange}
        placeholder="Enter new phone number"
      />

      {/* Update button */}
      <Button title="Update Profile" onPress={updateProfile} />

      <LocationManager />
    </View>
  )
}
