


import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '../Style/Styles';
import { fetchAllDocuments } from '../Firebase/firebaseHelper';
import LocationManager from '../Component/LocationManager';
import ItemsList from '../Component/ItemsList';

export default function Event({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchEvents() {
    try {
      const data = await fetchAllDocuments('Event'); // Fetch all events from Firebase
      setEvents(data);
      console.log('Events:', data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchEvents();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <>
      {/* Location Manager for map or geolocation */}
      <LocationManager />

      <View style={globalStyles.container}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          // Use ItemsList to render event data
          events.length > 0 ? (
           <ItemsList items={events} navigation={navigation} type="Event" />
          ) : (
            <Text>No Events Found</Text>
          )
        )}
      </View>
    </>
  );
}
