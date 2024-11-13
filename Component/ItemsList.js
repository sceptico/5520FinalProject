import { FlatList, View } from 'react-native'
import React from 'react'
import PressableItem from './PressableItem'
import ProductItem from './ProductItem'
import EventItem from './EventItem'
import { globalStyles } from '../Style/Styles'

export default function ItemsList({ items, navigation, type }) {
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
                navigation.navigate(type == 'Product' ? 'ProductDetail' : 'EventDetail', { itemId: item.id })
              }}
              componentStyle={globalStyles.productContainer}>
                {type == 'Product' ? (
                  <ProductItem item={item} />
                ) : (
                  <EventItem item={item} />
                )}
            </PressableItem>
          )
        }
      }
      ItemSeparatorComponent={() => <View style={globalStyles.listSeparator}/>}
      />
    </View>
  )
}