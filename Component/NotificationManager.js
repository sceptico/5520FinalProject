import { Alert, Button, Text, View } from 'react-native'
import { globalStyles } from '../Style/Styles'
import React from 'react'
import * as Notifications from "expo-notifications"

export default function NotificationManager() {
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
      await Notifications.scheduleNotificationAsync({
        content:{
          title:'Reminder set for Event name',
          body: 'This is the body of the notification',
        },
        trigger:{
          seconds:3
        }
      })
    } catch (err) {
      console.log('Error scheduling notification', err)
    }
  }
  return (
    <View>
      <Button title='Set Reminder for event' onPress={scheduleNotificationHandler}/>
    </View>
  )
}