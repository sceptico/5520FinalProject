import { Alert, Text, View } from 'react-native'
import { globalStyles } from '../Style/Styles'
import React, {useState} from 'react'
import * as Notifications from "expo-notifications"
import DropDownPicker from 'react-native-dropdown-picker'
import PressableItem from './PressableItem'
import { updateDocument, writeDocumentWithSpecificId } from '../Firebase/firebaseHelper'
import { arrayUnion, Timestamp } from 'firebase/firestore'
import { auth } from '../Firebase/firebaseSetup'


export default function NotificationManager({event}) {
  const eventName = event.name
  const eventDate = event.date
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(null)
  const [items, setItems] = useState([
    { label: '5 minutes before', value: 5 * 60 },
    { label: '15 minutes before', value: 15 * 60 },
    { label: '30 minutes before', value: 30 * 60 },
    { label: '1 hour before', value: 60 * 60 },
    { label: '1 day before', value: 24 * 60 * 60 },
  ]);

  async function verifyPermission() {
    try {
      const permissionResponse = await Notifications.getPermissionsAsync()
      if (permissionResponse.granted) {
        return true
      }
      const requestedPermissionResponse = 
      await Notifications.requestPermissionsAsync()
      return requestedPermissionResponse.granted
    } catch (err) {
      console.log("Error getting Notification Permissions", err)
    }
  }

  async function scheduleNotificationHandler() {
    try {
      const hasPermission = await verifyPermission()
      console.log("Permission", hasPermission)
      if (!hasPermission) {
        Alert.alert("Permission required", 'You need to grant notification permissions', [{text:'Ok'}])
      }
      if (!value) {
        Alert.alert('Time needed', 'Please select a reminder time', [{text:'Ok'}])
        return
      }
      const eventDateTime = new Date(eventDate)
      const reminderTime = new Date(eventDateTime.getTime() - value * 1000)

      if (reminderTime <= new Date()) {
        Alert.alert('Reminder time has passed. Please select a different time')
        return
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content:{
          title:`Reminder for ${eventName}`,
          body: 'This is the body of the notification',
        },
        trigger:{
          second:3
        }
        // trigger:reminderTime
      })
      const reminderData = {
        eventName,
        eventId:event.id,
        time:Timestamp.fromDate(reminderTime),
        ownerId:auth.currentUser.uid
      }

      await writeDocumentWithSpecificId("Reminder", notificationId, reminderData)
      await updateDocument("users", auth.currentUser.uid, {
        reminderSet:arrayUnion(
          notificationId
        )
      })
      console.log('user reminder updated')
      Alert.alert('Reminder has been set!')
    } catch (err) {
      console.log('Error scheduling notification', err)
    }
  }
  return (
    <View style={{alignItems:'flex-start'}}>
      <View style={{ marginTop:20, width:'80%', zIndex: open ? 2000 : 1 }}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder="Select reminder time"
          style={globalStyles.picker}
        />
      </View>
      <PressableItem 
        pressedFunction={scheduleNotificationHandler}>
        <Text style={globalStyles.buttonText}>Set Reminder</Text>
      </PressableItem>
    </View>
  )
}