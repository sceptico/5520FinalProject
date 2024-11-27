

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert } from "react-native";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db, auth } from "../Firebase/firebaseSetup";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { isLikedByUser } from "../Firebase/firebaseHelper";

export default function EventItem({ item }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false); // State to track if the event is liked
  const currentUser = auth.currentUser;

  const fetchEvent = async () => {
    try {
      const eventDocRef = doc(db, "Event", item.id); 
      const eventSnapshot = await getDoc(eventDocRef);

      if (eventSnapshot.exists()) {
        setEvent(eventSnapshot.data());
        // Check if the current user has liked the event
        if (currentUser && eventSnapshot.data().likedBy?.includes(currentUser.uid)) {
          setLiked(true);
        }
      } else {
        console.log("Event not found.");
      }
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async () => {
    if (!currentUser) {
      Alert.alert("Please login to like this event");
      return;
    }
    try {
      const eventRef = doc(db, "Event", item.id); 
      const userRef = doc(db, 'users', currentUser.uid);
      if (liked) {
        await updateDoc(eventRef, {
          likedBy: arrayRemove(currentUser.uid),
        });
        await updateDoc(userRef, {
          interestedEvents: arrayRemove(item.id), // Remove the product ID from likedProducts
        });
        setLiked(false);
      } else {
        await updateDoc(eventRef, {
          likedBy: arrayUnion(currentUser.uid),
        });
        await updateDoc(userRef, {
          interestedEvents: arrayUnion(item.id), // Add the product ID to likedProducts
        });
        setLiked(true);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [item.id]); 

  useEffect(() => {
    const checkLiked = async () => {
      // Check if the product is liked by the current user
      if (!currentUser) {
        setLiked(false);
        return
      }
      try {
        const isLiked = await isLikedByUser(item.id, currentUser.uid, "Event");
        console.log('itemId:', item.id, 'isLiked:', isLiked);
        setLiked(isLiked);
      } catch (error) {
        console.error('Error checking if product is liked:', error);
      }
    }
    checkLiked();
  }, [item.id, currentUser]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Event not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Event Image */}
        <View style={styles.photoContainer}>
          <Image
            source={
              event.image
                ? { uri: event.image }
                : require("../assets/club.jpg") // Default image if no image URL
            }
            style={styles.photo}
          />
        </View>

        {/* Event Details */}
        <View style={styles.right}>
          <Text style={styles.name}>{event.name}</Text>
          <Text style={styles.date}>{new Date(event.date).toLocaleString()}</Text>
          <Text style={styles.description} numberOfLines={5}>
            {event.description}
          </Text>
          <Text style={styles.organizer}>{event.organizer}</Text>
        </View>

        {/* Like Icon */}
        <View style={styles.likeWrapper}>
          <FontAwesome
            name={liked ? "star" : "star-o"}
            size={24}
            color={liked ? "gold" : "black"}
            onPress={toggleLike}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "95%",
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginVertical: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,

  },
  container: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    padding: 15,
    alignItems: "center",
  },
  photoContainer: {
    width: 100,
    height: 100,
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  right: {
    flex: 1,
    paddingLeft: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: "#444",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  organizer: {
    fontSize: 12,
    color: "#888",
  },
  likeWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 5,
    top: 5,
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
