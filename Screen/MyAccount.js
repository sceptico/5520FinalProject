import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import Color from '../Style/Color'
import PressableItem from '../Component/PressableItem'

export default function MyAccount({navigation}) {
  const [user, setUser] = useState(null)
  const auth = getAuth()
  
  useEffect(() => {
    const currentUser = auth.currentUser
    if (currentUser) {
      setUser({
        email: currentUser.email,
        uid: currentUser.uid,
        // name: currentUser.displayName,
        // phoneNumber: currentUser.phoneNumber,
        // photo: currentUser.photoURL
      })
    }
  }, [auth])

  return (
    <View style={styles.container}>
      {user ? (
        <>
        <Text>UID: {user.uid}</Text>
        <Text>Email: {user.email}</Text>
      {/* <Text>Phone Number</Text> */}
      <PressableItem
        pressedFunction={() => {
          navigation.navigate('User Favorite', { type: 'Product', userId: userId })
        }}
        componentStyle={{backgroundColor: 'white', padding: 10, margin: 5}}>
        <Text>Liked Products</Text>
      </PressableItem>
      <PressableItem
        pressedFunction={() => {
          navigation.navigate('User Favorite', { type: 'Event', userId: userId })
        }}
        componentStyle={{backgroundColor: 'white', padding: 10, margin: 5}}>
        <Text>Interested Events</Text>
      </PressableItem>
      <PressableItem
        pressedFunction={() => {
          navigation.navigate('User Favorite', { type: 'Product', userId: userId, myListings: true })
        }}
        componentStyle={{backgroundColor: 'white', padding: 10, margin: 5}}>
        <Text>My Listings</Text>
      </PressableItem>
      </>
      ) : (
        <Text>Not logged in</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.pageBackground,

  },
})