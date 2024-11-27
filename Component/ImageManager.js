import { StyleSheet, Image, View, Button } from 'react-native'
import React, {useState, useEffect} from 'react'
import * as ImagePicker from 'expo-image-picker'
import { storage } from '../Firebase/firebaseSetup'
import { ref, getDownloadURL } from "firebase/storage"

export default function ImageManager({receiveImageUri, initialUri}) {
  const [response, requestPermission] = ImagePicker.useCameraPermissions()
  const [imageUri, setImageUri] = useState(initialUri || "")

  async function verifyPermission() {
    //check if user has given permission
    //return true if permission granted
    if (response.granted) {
      return true
    }
    const permissionResponse = await requestPermission()
    return permissionResponse.granted
  }

  useEffect(() => {
    if (initialUri) {
      const fetchUrl = async () => {
        const url = await fetchDownloadUrl(initialUri);
        setImageUri(url);
      };
    fetchUrl();
    } else {
      setImageUri('')
    }
  }, [initialUri]);

  async function fetchDownloadUrl(path) {
    try {
      const imageRef = ref(storage, path);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error("Error fetching download URL:", error);
    }
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
    <View style={{margin:10}}>
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
