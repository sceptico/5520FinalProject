

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Modal, Pressable, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/firebaseSetup";
import { GeoPoint } from "firebase/firestore";
import { FontAwesome } from "@expo/vector-icons";

export default function EventMap({ navigation, route }) {
  const [events, setEvents] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const { mode } = route.params || {}; // Check the mode (e.g., view-events or select-location)

  // Fetch events from Firestore
  const fetchEvents = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Event"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle location confirmation
  const confirmCoordinateHandler = () => {
    setModalVisible(false);
    if (selectedLocation) {
      navigation.navigate("My Account", { selectedLocation });
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825, // Default location
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={(e) => {
          if (mode !== "view-events") {
            // Allow location selection only if not in view-events mode
            setSelectedLocation({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            });
            setModalVisible(true);
          }
        }}
      >
        {/* Render Event Markers */}
        {events.map((event) =>
          event.map instanceof GeoPoint ? (
            <Marker
              key={event.id}
              coordinate={{
                latitude: event.map.latitude,
                longitude: event.map.longitude,
              }}
              title={event.name}
              description={event.description}
            />
          ) : null
        )}

        {/* Render Selected Location Marker */}
        {mode !== "view-events" && selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Selected Location"
          />
        )}
      </MapView>

      {/* Confirmation Modal */}
      {mode !== "view-events" && (
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Confirm this location as your selection?
              </Text>
              <View style={styles.modalButtons}>
                {/* Confirm Button */}
                <Pressable
                  onPress={confirmCoordinateHandler}
                  style={[styles.button, styles.confirmButton]}
                >
                  <FontAwesome name="check" size={16} color="white" />
                  <Text style={styles.buttonText}>Confirm</Text>
                </Pressable>

                {/* Cancel Button */}
                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={[styles.button, styles.cancelButton]}
                >
                  <FontAwesome name="times" size={16} color="white" />
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  confirmButton: {
    backgroundColor: "blue",
  },
  cancelButton: {
    backgroundColor: "gray",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 5,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
