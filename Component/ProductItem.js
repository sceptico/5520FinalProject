import { Text, View } from 'react-native'
import { globalStyles } from '../Style/Styles'
import React from 'react'

export default function ProductItem({item}) {
  return (
    <View>
      <Text>{item.name} $xx location:xx pic_url</Text>
    </View>
  )
}
