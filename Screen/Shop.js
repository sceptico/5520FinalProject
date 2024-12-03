import { StyleSheet, Text, View, Image, FlatList, TextInput, useNavigation } from 'react-native';
import React, { useState } from 'react';
import { globalStyles } from '../Style/Styles';
import PressableItem from '../Component/PressableItem';



const categories = [
  { id: '1', name: 'Clubs', image: require('../assets/club.jpg'), isMainCategory: true },
  { id: '2', name: 'Apparel', image: require('../assets/golfApparel.png'), isMainCategory: true },
  { id: '3', name: 'Accessories', image: require('../assets/accessories.jpg'), isMainCategory: true },
  { id: '4', name: 'Men', image: require('../assets/Men.jpg'), isSubCategory: true },
  { id: '5', name: 'Women', image: require('../assets/women.jpg'), isSubCategory: true },
  { id: '6', name: 'Kids', image: require('../assets/kids.jpg'), isSubCategory: true },
];


export default function Shop({ navigation }) {
  const [searchText, setSearchText] = useState('');



  const onPressCategory = (category) => {
    if (category.isMainCategory) {
      // Handle navigation for mainCategory
      navigation.navigate('Product List', { mainCategory: category.name });
      console.log(`Pressed main category: ${category.name}`);
    } else if (category.isSubCategory) {
      // Handle navigation for subCategory
      navigation.navigate('Product List', { subCategory: category.name });
      console.log(`Pressed subcategory: ${category.name}`);
    } else {
      // Default or fallback logic (if needed)
      console.log(`Unknown category type: ${category.name}`);
    }
  };
  

  return (
    <View style={globalStyles.container}>
      {/* Search Bar */}
      <TextInput
        style={globalStyles.searchBar}
        placeholder="Search for products or brands"
        value={searchText}
        onChangeText={text => setSearchText(text)}
      />

      {/* Category Images */}
      <FlatList
        data={categories}
        numColumns={3} // 3 items per row
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PressableItem
            pressedFunction={() => onPressCategory(item)}>
            <View style={globalStyles.itemContainer}>
              <Image source={item.image} style={globalStyles.image} />
              <Text style={globalStyles.categoryName}>{item.name}</Text>
            </View>
          </PressableItem>
        )}
        contentContainerStyle={globalStyles.grid}
      />
    </View>
  );
}
