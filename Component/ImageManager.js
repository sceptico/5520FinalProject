import { StyleSheet, Image, View, Button } from 'react-native'
import React, {useState} from 'react'
import * as ImagePicker from 'expo-image-picker'

export default function ImageManager({receiveImageUri}) {
  const [response, requestPermission] = ImagePicker.useCameraPermissions()
  const [imageUri, setImageUri] = useState("")

  async function verifyPermission() {
    //check if user has given permission
    //return true if permission granted
    if (response.granted) {
      return true
    }
    const permissionResponse = await requestPermission()
    return permissionResponse.granted
  }
  
  async function takeImageHandler() {
    try {
      //call verify permission
      const hasPermission = await verifyPermission()
      if (!hasPermission) {
        Alert.alert('Permission required', 'You need to grant camera permissions to use this feature', [{text:'Okay'}])
        return
      }
      const result = await ImagePicker.launchCameraAsync(
        {allowsEditing:true}
      )
      if (!result.canceled) {
        setImageUri(result.assets[0].uri)
        //imageUri is still empty in the render
        receiveImageUri(result.assets[0].uri)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <View>
      <Button title='Take an image' onPress={takeImageHandler}/>
      {imageUri && (
      <Image source={{uri:imageUri}} 
      style={styles.image}
      alt="preview of the image user has taken"/>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    margin:10
  },
})
