import { Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getItem } from '../Firebase/firebaseHelper';
import { globalStyles } from '../Style/Styles';

export default function EventDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { itemId } = route.params;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const fetchedEvent = await getItem('Event', itemId);
        setEvent(fetchedEvent);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [itemId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!event) {
    return <Text>Event not found</Text>;
  }

  const { title, description, eventDate, location } = event;

  return (
    <View style={globalStyles.detailContainer}>
      <Text style={globalStyles.detailTitle}>{title}</Text>
      <Text style={globalStyles.detailText}>{description}</Text>
      <Text style={globalStyles.detailText}>Event Date: {eventDate}</Text>
      <Text style={globalStyles.detailText}>Location: {location}</Text>
    </View>
  );
}
