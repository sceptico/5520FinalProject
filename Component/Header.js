import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons';
import Color from '../Style/Color';

export default function Header() {
  const [city, setCity] = useState(''); // State to store city name
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get the current location
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      
      // Reverse geocode to get the city name
      let address = await Location.reverseGeocodeAsync(location.coords);
      setCity(address[0]?.city || 'Unknown City'); // Set city or default to "Unknown City"
    })();
  }, []);

  return (
    <View style={styles.headerContainer}>
      <Image source={require('../assets/parteelogo.png')} style={styles.logo} />
      <View style={styles.locationContainer}>
        <FontAwesome name="location-arrow" size={16} color="white" style={styles.compassIcon} />
        <Text style={styles.cityText}>
          {errorMsg ? errorMsg : city}
        </Text>
      </View>
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
    bottom: 1, // Adjust position above city text
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20, // Position near the bottom of the header
    left: 5,
  },
  compassIcon: {
    marginRight: 5, // Space between icon and city name
    marginLeft: 5, // Space between icon and edge of screen,
  },
  cityText: {
    fontSize: 12,
    color: 'white', // Customize the text color
  },
});
