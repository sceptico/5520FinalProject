import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Color from '../Style/Color'
import PressableItem from '../Component/PressableItem'

export default function MyAccount({navigation}) {
  //const {currentUser} = auth //when using firebase authentication
  

  return (
    <View style={styles.container}>
      <Text>User Name</Text>
      <Text>Email</Text>
      {/* <Text>Phone Number</Text> */}
      <PressableItem
        pressedFunction={() => {
          navigation.navigate('User Favorite', { type: 'Product', userId: 'userId' })
        }}
        componentStyle={{backgroundColor: 'white', padding: 10, margin: 5}}>
        <Text>Liked Products</Text>
      </PressableItem>
      <PressableItem
        pressedFunction={() => {
          navigation.navigate('User Favorite', { type: 'Event', userId: 'userId' })
        }}
        componentStyle={{backgroundColor: 'white', padding: 10, margin: 5}}>
        <Text>Interested Events</Text>
      </PressableItem>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.pageBackground,

  },
})