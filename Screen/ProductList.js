import { Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../Style/Styles'
import ItemsList from '../Component/ItemsList'
import { getItemsByCategory } from '../Firebase/firebaseHelper'


export default function ProductList({navigation, route}) {
  const { mainCategory, subCategory } = route.params || {};
  console.log(route.params)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true);

  if (!mainCategory && !subCategory) {
    return (
      <View>
        <Text>No category selected</Text>
      </View>
    );
  }

//   useEffect(() => {
//     navigation.setOptions({ title: categoryName });
// }, [navigation, categoryName]);

//   const getItems = async () => {
//     try {
//       const data = await getItemsByCategory('Product', categoryName)
//       setItems(data)
//     } catch (error) {
//       console.log("Error getting items: ${error}")
//     }
//   }

//     useEffect(() => {
//       const unsubscribe = navigation.addListener('focus', () => {
//         getItems()
//       })
//       return unsubscribe
//     }, [navigation])


useEffect(() => {
  navigation.setOptions({
    title: `${mainCategory || ''}${subCategory ? ` > ${subCategory}` : ''}`,
  });
}, [navigation, mainCategory, subCategory]);

// Fetch items based on categories
const getItems = async () => {
  try {
    const data = await getItemsByCategory('Product', { mainCategory, subCategory });
    setItems(data);
  } catch (error) {
    console.error(`Error getting items: ${error}`);
  } finally {
    setLoading(false);
  }
};

// Add listener to fetch items on screen focus
useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    getItems();
  });
  return unsubscribe;
}, [navigation, mainCategory, subCategory]);

if (loading) {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

if (items.length === 0) {
  return (
    <View>
      <Text>No items found for {mainCategory || ''} {subCategory || ''}.</Text>
    </View>
  );
}


  return (
    <View style={globalStyles.listContainer}>
      {/* <Text>{categoryName}</Text> */}
      <ItemsList items={items} navigation={navigation} type='Product' />
    </View>
  )
}