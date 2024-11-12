import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function ProductDetail({ navigation, route }) {
  const { itemId } = route.params
  return (
    <View>
      <Text>Product Id:{itemId}</Text>
    </View>
  )
}

const styles = StyleSheet.create({})