import { Text, View } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { auth, db } from '../Firebase/firebaseSetup'
import {updateDocument} from '../Firebase/firebaseHelper'
import { globalStyles } from '../Style/Styles'
import LocationManager from '../Component/LocationManager'

export default function EditProfile({navigation, route}) {
  console.log(route.params)
  
  const [uid, setUid] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [imageURL, setImageURL] = useState('')
  const [DOB, setDOB] = useState('')
  const [golfYears, setGolfYears] = useState('')

  useEffect(() => {
    const { uid, email, name, phone, imageURL } = route.params
    setUid(uid)
    setEmail(email)
    setName(name)
    setPhone(phone)
    setImageURL(imageURL)
  }
  , [route.params])

  return (
    <View>
      <Text>EditProfile</Text>
           <LocationManager />
    </View>
  )
}
