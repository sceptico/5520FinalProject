import { Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { globalStyles } from '../Style/Styles'
import { signOut } from 'firebase/auth'
import PressableItem from '../Component/PressableItem'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Color from '../Style/Color'

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
    <View style={globalStyles.formContainer}>
      {user ? (
        <>
        <View style={{marginBottom:30, gap:10}}>
          <Text>UID: {user.uid}</Text>
          <Text>Email: {user.email}</Text>
          {user.name && <Text>Name: {user.name}</Text>}
          {user.phoneNumber && <Text>Phone: {user.phoneNumber}</Text>}
          <PressableItem
            pressedFunction={() => {
              console.log({ user })
              navigation.navigate('Edit Profile', { user })
            }}>
            <Text>Edit Profile</Text>
          </PressableItem>
          <PressableItem
            componentStyle={{backgroundColor: Color.headerBackground, width:80, borderRadius:5}}
            pressedFunction={() => {
              signOut(auth)
              setUser(null)
            }}>
            <Text style={{color:'white'}}>Logout</Text>
          </PressableItem>
          
      </View>
        
      <PressableItem
        pressedFunction={() => {
          navigation.navigate('User Favorite', { type: 'Product', userId: user.uid })
        }}
        componentStyle={globalStyles.pressable}
        pressedStyle={globalStyles.pressablePressed}>
        <View style={{flexDirection: 'row', width:160 }}>
          <FontAwesome
          name={'heart-o'}
          size={16}
          color={'black'}
          style={{left:10}}
          />
          <Text style={{left:30}}>Liked Products</Text>
        </View>
      </PressableItem>
      <PressableItem
        pressedFunction={() => {
          navigation.navigate('User Favorite', { type: 'Event', userId: user.uid })
        }}
        componentStyle={globalStyles.pressable}
        pressedStyle={globalStyles.pressablePressed}>
        <View style={{flexDirection: 'row', width:160 }}>
          <FontAwesome
          name={'star-o'}
          size={16}
          color={'black'}
          style={{left:10}}
          />
          <Text style={{left:30}}>Interested Events</Text>
        </View>
      </PressableItem>
      <PressableItem
        pressedFunction={() => {
          navigation.navigate('User Favorite', { type: 'Product', userId: user.uid, myListings: true })
        }}
        componentStyle={globalStyles.pressable}
        pressedStyle={globalStyles.pressablePressed}>
        <View style={{flexDirection: 'row', width:160 }}>
          <FontAwesome
          name={'list-alt'}
          size={16}
          color={'black'}
          style={{left:10}}
          />
          <Text style={{left:30}}>My Listings</Text>
        </View>
      </PressableItem>
      </>
      ) : (
        <>
          <Text>Not logged in</Text>
        </>
      )}
    </View>
  )
}
