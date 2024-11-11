import { FlatList, Text, View } from 'react-native'
import React from 'react'
import PressableItem from './PressableItem'
import ProductItem from './ProductItem'

export default function ItemsList({ items, navigation }) {
  console.log('ItemsList items:', items)
  return (
    <View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <PressableItem
              pressedFunction={() => {
                //navigate to ProductDetail screen with itemId as parameter
                navigation.navigate('ProductDetail', { itemId: item.id })
              }}>
              <ProductItem item={item} />
            </PressableItem>
          )
        }
      }
      />
    </View>
  )
}