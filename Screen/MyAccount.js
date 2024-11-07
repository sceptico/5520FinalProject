import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Color from '../Style/Color'

export default function MyAccount() {
  return (
    <View style={styles.container}>
      <Text>My Account</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.pageBackground,

  },
})
