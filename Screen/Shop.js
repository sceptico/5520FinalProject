import { StyleSheet, Text, View, Image, FlatList, TextInput } from 'react-native';
import React, { useState } from 'react';
import { globalStyles } from '../Style/Styles';
import PressableItem from '../Component/PressableItem';

const categories = [
  { id: '1', name: 'Clubs', image: require('../assets/club.jpg') },
  { id: '2', name: 'Apparel', image: require('../assets/golfApparel.png') },
  { id: '3', name: 'Accessories', image: require('../assets/accessories.jpg') },
  { id: '4', name: 'Men', image: require('../assets/Men.jpg') },
  { id: '5', name: 'Women', image: require('../assets/women.jpg') },
  { id: '6', name: 'Kids', image: require('../assets/kids.jpg') },
];

export default function Shop() {
  const [searchText, setSearchText] = useState('');

  const onPressCategory = (category) => {
    console.log(`Pressed category: ${category.name}`);
  }

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
            item={item}
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
