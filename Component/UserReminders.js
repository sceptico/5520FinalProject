import { Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../Style/Styles'
import ItemsList from '../Component/ItemsList'
import { fetchUserListingsOrReminders } from '../Firebase/firebaseHelper'
import { auth } from '../Firebase/firebaseSetup'
import { useNavigation, useRoute } from '@react-navigation/native'


export default function UserReminders() {
  const navigation = useNavigation()
  const route = useRoute()
  const currentUser = auth.currentUser
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true);

  const fetchReminders = async () => {
    try {
      data = await fetchUserListingsOrReminders(currentUser.uid, 'Reminder'); // Fetch user's reminders
      console.log('fetched reminder data', data)
      setReminders(data);
    } catch (error) {
      console.log(`Error fetching reminders:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [currentUser]);

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Text>Loading Reminders...</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      {reminders.length > 0 ? (
      <ItemsList items={reminders} navigation={navigation} type='Reminder' />
      ) : (
        <Text>No Reminders</Text>
      )}
    </View>
  );
}