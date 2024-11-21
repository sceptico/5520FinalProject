import { Text, View } from 'react-native'
import React, {useEffect, useState} from 'react'

import { globalStyles } from '../Style/Styles'

export default function EditProfile({navigation, route}) {
  console.log(route.params)
  
  const [uid, setUid] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [imageURL, setImageURL] = useState('')

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
    </View>
  )
}
