import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { auth, db } from '../Firebase/firebaseSetup';
import { doc, getDoc } from 'firebase/firestore';
import Color from '../Style/Color';
import PressableItem from './PressableItem';
import { globalStyles } from '../Style/Styles';
import { useNavigation } from '@react-navigation/native';

export default function Header() {
  const [city, setCity] = useState(''); // State to store city name
  const [errorMsg, setErrorMsg] = useState(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const user = auth.currentUser;
  console.log(user)
  const navigation = useNavigation()

  useEffect(() => {
    // Fetch location data
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      let address = await Location.reverseGeocodeAsync(location.coords);
      setCity(address[0]?.city || 'Unknown City');
    })();
  }, []);

  useEffect(() => {
    // Fetch favorite items count if user is logged in
    const fetchFavoritesCount = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFavoritesCount(data.likedProducts?.length || 0);
        }
      }
    };

    fetchFavoritesCount();
  }, [user]);

  return (
    <View style={styles.headerContainer}>
      <Image source={require('../assets/parteelogo.png')} style={styles.logo} />
      <View style={styles.locationContainer}>
        <FontAwesome name="location-arrow" size={16} color="white" style={styles.compassIcon} />
        <Text style={styles.cityText}>
          {errorMsg ? errorMsg : city}
        </Text>
      </View>
      <PressableItem
        componentStyle={styles.heartContainer}
        pressedStyle={globalStyles.pressablePressed}
        pressedFunction={() => {
          navigation.navigate('User Favorite', { type: 'Product', userId: user.uid })
        }}
      >
        {user!==null ? <FontAwesome5 name="heart" size={20} color="white" /> :<></>}
        {user!==null ?<Text style={styles.heartCount}>{favoritesCount}</Text> :<></>}
      </PressableItem>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.logoHeader,
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  logo: {
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 1,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 5,
  },
  compassIcon: {
    marginRight: 5,
  },
  cityText: {
    fontSize: 12,
    color: 'white',
  },
  heartContainer: {
    position: 'absolute',
    right: 10,
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center'
  },
  heartCount: {
    marginLeft: 5,
    fontSize: 14,
    color: 'white',
  },
});
