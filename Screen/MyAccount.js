import { Button, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { globalStyles } from '../Style/Styles'
import { signOut } from 'firebase/auth'
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
    <View style={globalStyles.listContainer}>
      {user ? (
        <>
        <Text>UID: {user.uid}</Text>
        <Text>Email: {user.email}</Text>
        <Button title='Sign Out' onPress={() => {
          signOut(auth)
          setUser(null)
        }
        }/>
      {/* <Text>Phone Number</Text> */}
      <PressableItem
        pressedFunction={() => {
          navigation.navigate('User Favorite', { type: 'Product', userId: user.uid })
        }}
        componentStyle={globalStyles.pressable}
        pressedStyle={globalStyles.pressablePressed}>
        <Text>Liked Products</Text>
      </PressableItem>
      <PressableItem
        pressedFunction={() => {
          navigation.navigate('User Favorite', { type: 'Event', userId: user.uid })
        }}
        componentStyle={globalStyles.pressable}
        pressedStyle={globalStyles.pressablePressed}>
        <Text>Interested Events</Text>
      </PressableItem>
      <PressableItem
        pressedFunction={() => {
          navigation.navigate('User Favorite', { type: 'Product', userId: user.uid, myListings: true })
        }}
        componentStyle={globalStyles.pressable}
        pressedStyle={globalStyles.pressablePressed}>
        <Text>My Listings</Text>
      </PressableItem>
      </>
      ) : (
        <>
          <Text>Not logged in</Text>
          <PressableItem
            pressedFunction={() => {
              navigation.navigate('Login')
            }}>
            <Text>Login</Text>
          </PressableItem>
        </>
      )}
    </View>
  )
}
