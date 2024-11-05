import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Color from '../Style/Color'

export default function Shop() {
  return (
    <View style={styles.container}>
      <Text>Shop</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.pageBackground,

  },
})
