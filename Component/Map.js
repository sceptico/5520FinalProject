
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { FontAwesome } from "@expo/vector-icons";

export default function Map({ navigation, route }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [initialLocation, setInitialLocation] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  function confirmCoordinateHandler() {
    setModalVisible(false);
    navigation.navigate("My Account", { selectedLocation });
  }

  useEffect(() => {
    if (route.params && route.params.initialLocation) {
      setInitialLocation(route.params.initialLocation);
    }
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        initialRegion={{
          latitude: initialLocation ? initialLocation.latitude : 37.78825,
          longitude: initialLocation ? initialLocation.longitude : -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={styles.map}
        onPress={(e) => {
          setSelectedLocation({
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
          });
          setModalVisible(true); // Show modal when a location is selected
        }}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Selected Location"
            onPress={() => setModalVisible(true)} // Trigger modal on marker press
          />
        )}
      </MapView>

      {/* Confirmation Modal */}
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
              <PressableItem
                pressedFunction={confirmCoordinateHandler}
                componentStyle={styles.pressable}
                pressedStyle={styles.pressablePressed}
              >
                <View style={styles.buttonContent}>
                  <FontAwesome
                    name="check"
                    size={16}
                    color="white"
                    style={styles.icon}
                  />
                  <Text style={styles.buttonText}>Confirm</Text>
                </View>
              </PressableItem>

              {/* Cancel Button */}
              <PressableItem
                pressedFunction={() => setModalVisible(false)}
                componentStyle={[styles.pressable, styles.cancelPressable]}
                pressedStyle={styles.pressablePressed}
              >
                <View style={styles.buttonContent}>
                  <FontAwesome
                    name="times"
                    size={16}
                    color="white"
                    style={styles.icon}
                  />
                  <Text style={styles.buttonText}>Cancel</Text>
                </View>
              </PressableItem>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function PressableItem({ pressedFunction, componentStyle, pressedStyle, children }) {
  return (
    <Pressable
      onPress={pressedFunction}
      style={({ pressed }) => [componentStyle, pressed && pressedStyle]}
    >
      {children}
    </Pressable>
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
  pressable: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
    alignItems: "center",
  },
  cancelPressable: {
    backgroundColor: "gray",
  },
  pressablePressed: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
