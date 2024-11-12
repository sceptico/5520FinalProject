import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Color from '../Style/Color'

export default function MyAccount() {
  return (
    <View style={styles.container}>
      <Text>User Name</Text>
      <Text>Email</Text>
      <Text>Phone Number</Text>
      <Text>Liked Items</Text>
      <Text>My Listings</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.pageBackground,

  },
})