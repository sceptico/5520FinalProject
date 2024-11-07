import { StyleSheet, Text, View, Image, FlatList, TextInput } from 'react-native';
import React, { useState } from 'react';
import Color from '../Style/Color';

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

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
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
          <View style={styles.itemContainer}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.categoryName}>{item.name}</Text>
          </View>
        )}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.pageBackground,
    alignItems: 'center',
    paddingTop: 40,
  },
  searchBar: {
    height: 40,
    width: '90%',
    backgroundColor: Color.searchBar,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 14,
  },
  grid: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    alignItems: 'center',
    margin: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50, // Make the image circular
    resizeMode: 'cover',
  },
  categoryName: {
    marginTop: 5,
    fontSize: 14,
    color: Color.headerBackground,
    fontWeight: 'bold',
  },
});
