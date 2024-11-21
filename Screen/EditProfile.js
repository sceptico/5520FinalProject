import { Text, TextInput, View } from 'react-native'
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
    const user = route.params.user
    setUid(user.uid)
    setEmail(user.email)
    setName(user.name)
    setPhone(user.phone)
    setImageURL(user.imageURL)
  }
  , [route.params])

  const nameHandler = (text) => {
    setName(text)
  }
  return (
    <View style={globalStyles.formContainer}>
      <Text>UID: {uid}</Text>
      <Text>Email: {email}</Text>
      <Text>Name</Text>
      <TextInput style={globalStyles.input} value={name} onChangeText={nameHandler}/>
    </View>
  )
}
