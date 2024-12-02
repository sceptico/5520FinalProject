
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Weather from '../Component/Weather';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/firebaseSetup'; // Import your Firebase setup
import Color from '../Style/Color';
import ProductList from './ProductList';
import { ScrollView } from 'react-native';

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
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const flatListRef = useRef(null);

  // Fetch the most liked event
  const fetchFeaturedEvent = async () => {
    try {
      const eventQuery = query(collection(db, 'Event'), orderBy('likes', 'desc'), limit(1));
      const querySnapshot = await getDocs(eventQuery);

      if (!querySnapshot.empty) {
        const mostLikedEvent = querySnapshot.docs[0].data();
        setFeaturedEvent(mostLikedEvent);
      }
    } catch (error) {
      console.error('Error fetching featured event:', error);
    }
  };

  useEffect(() => {
    fetchFeaturedEvent();
  }, []);

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
    <ScrollView style={{ flex: 1 }}>
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

            <View style={styles.row}>
              <Weather />
              <View style={styles.featuredEventContainer}>
                {featuredEvent ? (
                  <View style={styles.featuredEventContent}>
                    <View style={styles.featuredEventDateContainer}>
                      <View style={styles.dateRow}>
                        <Text style={styles.featuredEventDay}>
                          {new Date(featuredEvent.date.seconds * 1000).getDate()}
                        </Text>
                        <Text style={styles.featuredEventMonth}>
                          {new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
                            new Date(featuredEvent.date.seconds * 1000)
                          )}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.featuredEventDetailsContainer}>
                      <Text style={styles.featuredEventTitle}>{featuredEvent.name}</Text>
                      <Text style={styles.featuredEventLikes}>Likes: {featuredEvent.likes}</Text>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.loadingText}>Loading...</Text>
                )}
              </View>
            </View>
      
          <ProductList mode="latest" navigation={navigation} />
  
        </ScrollView>
  );
}







const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.pageBackground,
    justifyContent: 'flex-start',
    alignItems: 'center',

  },
  image: {
    width: screenWidth,
    height: screenWidth * 0.5,
    resizeMode: 'cover',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    paddingHorizontal: 10,
    width: '100%',
  },
  featuredEventContainer: {
    flex: 1,
    height: 120,
    width: '60%',
    backgroundColor: 'rgba(246, 251, 242, 0.99)',
    borderRadius:20,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,

  },
  featuredEventContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featuredEventDateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: 'rgba(80, 143, 142, 0.99)',
    padding: 10,
    borderRadius: 8,
    height: 110,
    width: 110,

    alignContent: 'center',


  },
  featuredEventDateLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 5,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredEventDate: {
    fontSize: 12,
    color: '#666',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredEventDay: {
    fontSize: 55,
    color: '#FFF',
    fontWeight: 'bold',
   alignItems: 'center',
    justifyContent: 'center',
  },
  featuredEventMonth: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  featuredEventDetailsContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  featuredEventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'rgba(41, 88, 87, 0.99)',
  },
  featuredEventLikes: {
    fontSize: 14,
    color: 'rgba(122, 190, 189, 0.99)',
  },
  loadingText: {
    fontSize: 14,
    color: '#888',
  },

});
