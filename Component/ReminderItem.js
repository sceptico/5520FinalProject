import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { doc, getDoc, updateDoc, arrayRemove, Timestamp } from "firebase/firestore";
import { db, auth } from "../Firebase/firebaseSetup";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { getItem } from "../Firebase/firebaseHelper";

export default function ReminderItem({reminderId}) {
  const [reminder, setReminder] = useState(null)
  const [loading, setLoading] = useState(true)
  const currentUser = auth.currentUser

  const fetchReminder = async() => {
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const userReminders = userData.reminderSet || [];
        const foundReminder = userReminders.find((r) => r === reminderId);

        if (foundReminder) {
          const reminderData = await getItem('Reminder', foundReminder)
          setReminder(reminderData);
        } else {
          console.log("Reminder not found.");
        }
      }
    } catch (error) {
      console.error("Error fetching reminder:", error);
    } finally {
      setLoading(false);
    }
  }

  const deleteReminder = async () => {
    try {
      const userDocRef = doc(db, 'users', currentUser.uid)
      await updateDoc(userDocRef, {
        reminderSet:arrayRemove(reminder.id)
      })
      Alert.alert('Reminder deleted')
      setReminder(null)
    } catch (err) {
      console.error("Error deleting reminder:", err)
    }
  }

  useEffect(() => {
    fetchReminder()
  },[reminderId, currentUser])

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!reminder) {
    return null;  // Do not render anything if reminder is not found
  }
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Reminder Details */}
        <View>
          {!loading ? (<Text style={styles.name}>{reminder.eventName}</Text>):<Text>Loading Reminder</Text>}
          {!loading ? (<Text style={styles.time}>{new Date(reminder.time.seconds * 1000).toLocaleString()}</Text>)
          :<></>}
        </View>

        {/* Delete Icon */}
        <View style={styles.deleteWrapper}>
          <FontAwesome
            name="trash"
            size={24}
            color="red"
            onPress={() =>
              Alert.alert(
                "Delete Reminder",
                "Are you sure you want to delete this reminder?",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Delete", style: "destructive", onPress: deleteReminder },
                ]
              )
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  container: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    marginBottom: 5,
  },
  time: {
    fontSize: 12,
    color: "#444",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  deleteWrapper: {
    marginLeft:10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});