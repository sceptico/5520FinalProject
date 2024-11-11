import { Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../Style/Styles'
import ItemsList from '../Component/ItemsList'
import { fetchAllDocuments, getItemsByCategory } from '../Firebase/firebaseHelper'


export default function ProductList({navigation, route}) {
  const {categoryName} = route.params
  const [items, setItems] = useState([])

  const getItems = async () => {
    try {
      // const data = await getItemsByCategory('items', categoryName)
      const data = await fetchAllDocuments('items')
      setItems(data)
    } catch (error) {
      console.log("Error getting items: ${error}")
    }
  }

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        getItems()
      })
      return unsubscribe
    }, [navigation])

  return (
    <View style={globalStyles.container}>
      <Text>{categoryName}</Text>
      <ItemsList items={items} navigation={navigation} />
    </View>
  )
}

