import { Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getItem } from '../Firebase/firebaseHelper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { globalStyles } from '../Style/Styles';

export default function EventDetail() {
  //const { currentUser } = auth // get the current user after auth implementation
  const navigation = useNavigation();
  const route = useRoute();
  const { itemId } = route.params;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interested, setInterested] = useState(false);

  const handleInterest = () => {
    // push the interestedEvent to the user's interestedEvents array
    // and update the user document in the 'users' collection
    // prompts the user to login if not authenticated
    // pending auth implementation

    setInterested(!interested);
  }

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

  const { title, description, location } = event;

  return (
    <View style={globalStyles.detailContainer}>
      <Text style={globalStyles.detailTitle}>{title}</Text>
      <Text style={globalStyles.detailText}>Description: {description}</Text>
      <Text style={globalStyles.detailText}>Location: {location}</Text>
      <FontAwesome
        name={interested ? 'heart' : 'heart-o'}
        size={24}
        color={interested ? 'red' : 'black'}
        onPress={handleInterest}
      />
    </View>
  );
}
