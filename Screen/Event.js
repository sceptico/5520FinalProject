import { Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../Style/Styles'
import { fetchAllDocuments } from '../Firebase/firebaseHelper'
import LocationManager from '../Component/LocationManager'

export default function Event({navigation}) {
  const [events, setEvents] = useState('')
  const [loading, setLoading] = useState(true)
  
  async function fetchEvents() {
    try {
      const data = await fetchAllDocuments('Event')
      setEvents(data)
      console.log('Events:', data)
      setLoading(false)
    } catch (error) {
      console.log('Error fetching events:', error)
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchEvents()
    })
    return unsubscribe
  }, [navigation])

  return (
    <View style={globalStyles.container}>
      <LocationManager />
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        // displaying successful reads from Event firebase collection
        events.map((event) => (
          <Text key={event.id}>{event.name} 
          </Text>
         

        ))
      )}
    </View>
  )
}
