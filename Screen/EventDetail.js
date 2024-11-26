import { Image, StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getItem, updateDocument } from '../Firebase/firebaseHelper';
import { auth, db, storage } from '../Firebase/firebaseSetup';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import DropDownPicker from 'react-native-dropdown-picker';
import NotificationManager from '../Component/NotificationManager';

export default function EventDetail() {
  const { currentUser } = auth; // Get the current user after auth implementation
  const navigation = useNavigation();
  const route = useRoute();
  const { itemId } = route.params;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interested, setInterested] = useState(false); // Track user interest
  const [downloadURL, setDownloadURL] = useState(''); // Store image URL
  // const [reminderTime, setReminderTime] = useState(null)

  useEffect(() => {
    async function getImageDownloadURL() {
      try {
        if (route.params && route.params.imageUri) {
          const imageRef = ref(storage, route.params.imageUri);
          const downloadImageURL = await getDownloadURL(imageRef);
          setDownloadURL(downloadImageURL); // Set the remote image URL
        } else {
          // Use local default image if no imageUri is provided
          setDownloadURL('local'); // Mark it as local
        }
      } catch (error) {
        console.error('Error fetching image URL:', error);
        setDownloadURL('local'); // Fallback to local image on error
      }
    }
    getImageDownloadURL();
  }, [route.params]);
  

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const fetchedEvent = await getItem('Event', itemId);
        setEvent(fetchedEvent);

        // Check if the event is already in user's interestedEvents
        if (currentUser) {
          const userDoc = await getItem('users', currentUser.uid);
          if (userDoc.interestedEvents?.includes(itemId)) {
            setInterested(true);
          }
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [itemId]);

  const handleInterest = async () => {
    if (!currentUser) {
      Alert.alert('Please login to mark your interest in this event');
      navigation.navigate('Login');
      return;
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      if (interested) {
        await updateDoc(userRef, {
          interestedEvents: arrayRemove(itemId),
        });
      } else {
        await updateDoc(userRef, {
          interestedEvents: arrayUnion(itemId),
        });
      }
      setInterested(!interested);
    } catch (error) {
      console.error('Error updating interest:', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!event) {
    return <Text>Event not found</Text>;
  }

  // const handleSetReminder = async () => {
  //   if (!reminderTime) {
  //     Alert.alert('Select Reminder Time', 'Please choose a time')
  //     return
  //   }
  //   try {
  //     await NotificationManager.scheduleReminder(event, reminderTime)
  //     Alert.alert('Reminder set')
  //   } catch (err) {
  //     console.log('Error setting the reminder', err)
  //   }
  // }

  const { name, description, location, date } = event;

  return (
    <View style={styles.container}>
      {downloadURL && (
        <View style={styles.imageContainer}>
         <Image
            source={
              downloadURL === 'local'
                ? require('../assets/socialGolf.png') // Local default image
                : { uri: downloadURL } // Remote image
            }
            style={styles.image}
          />
        </View>
      )}
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.location}>Location: {location}</Text>
      <Text style={styles.date}>Date: {new Date(date).toLocaleString()}</Text>
      <FontAwesome
        name={interested ? 'star' : 'star-o'}
        size={24}
        color={interested ? 'gold' : 'black'}
        onPress={handleInterest}
      />
      <NotificationManager event={event}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    textAlign: 'justify',
  },
  location: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  image: {
    width: 400,
    height: 200,
    margin: 10,
  },
  imageContainer: {
    alignItems: 'center',
  },
});
