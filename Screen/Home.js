import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Color from '../Style/Color';
import { useNavigation } from '@react-navigation/native';
import Shop from './Shop';
import Event from './Event';

// Get the width of the device screen
const { width: screenWidth } = Dimensions.get('window');

const images = [
  { id: '1', src: require('../assets/greenfuture.png'), screen: 'Shop' },
  { id: '2', src: require('../assets/socialGolf.png'), screen: 'Event' },
  { id: '3', src: require('../assets/golfCourse.jpg'), screen: 'Event' },
];

export default function Home() {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const onNavigate = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
  
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={flatListRef}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onNavigate(item.screen)}>
            <Image source={item.src} style={styles.image} />
          </TouchableOpacity>
        )}
        onScrollToIndexFailed={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.pageBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Color.headerText,
  },
  image: {
    width: screenWidth, // Set image width to match the screen width
    height: screenWidth * 0.5, // Adjust the height proportionally (50% of the screen width)
    resizeMode: 'cover',
  },
});
