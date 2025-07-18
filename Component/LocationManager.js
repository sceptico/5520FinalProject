
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { useRoute, useNavigation } from "@react-navigation/native";
import { GeoPoint } from "firebase/firestore";
import { updateDocument } from "../Firebase/firebaseHelper";
import { auth } from "../Firebase/firebaseSetup";
import PressableItem from "./PressableItem";
import { globalStyles } from "../Style/Styles";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Color from "../Style/Color";

export default function LocationManager() {
  const [location, setLocation] = useState(null);
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [response, requestPermission] = Location.useForegroundPermissions();
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    async function fetchLocation() {
      const hasPermission = await verifyPermission();
      if (!hasPermission) {
        Alert.alert("You need to give location permission to view the map.");
        return;
      }
      try {
        const locationResponse = await Location.getCurrentPositionAsync();
        setLocation({
          latitude: locationResponse.coords.latitude,
          longitude: locationResponse.coords.longitude,
        });
      } catch (err) {
        console.log("Error fetching location: ", err);
      }
    }

    // Update location from route params if available
    if (route.params?.selectedLocation) {
      setLocation(route.params.selectedLocation);
      setIsLocationSelected(true);
    } else {
      fetchLocation();
    }
  }, [route]);

  async function verifyPermission() {
    try {
      if (response?.granted) {
        return true;
      }
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    } catch (err) {
      console.log("verifyPermission error: ", err);
    }
  }

  function chooseLocationHandler() {
    navigation.navigate("Map", {
      initialLocation: location, // Pass the current location
      mode: route.name === "Event" ? "view-events" : "select-location", // Pass the mode
    });
  }

  function saveLocationHandler() {
    try {
      updateDocument("users", auth.currentUser.uid, {
        location: new GeoPoint(location.latitude, location.longitude),
      });
      Alert.alert("Success", "Your location has been saved.");
      setIsLocationSelected(false); // Reset to show "Choose My Location"
    } catch (err) {
      console.log("Error saving location: ", err);
    }
  }

  return (
    <View>
      {location && (
        <Image
          source={{
            uri: `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:L%7C${location.latitude},${location.longitude}&key=${process.env.EXPO_PUBLIC_mapsApiKey}`,
          }}
          style={styles.map}
          alt="static map"
        />
      )}

      {isLocationSelected ? (
        <PressableItem
          pressedFunction={saveLocationHandler}
          componentStyle={globalStyles.pressable}
          pressedStyle={globalStyles.pressablePressed}
        >
          <View style={{ flexDirection: "row", width: 200 }}>
            <FontAwesome
              name="save"
              size={16}
              color="black"
              style={{ left: 10 }}
            />
            <Text style={{ left: 30 }}>Save My Location</Text>
          </View>
        </PressableItem>
      ) : (
        <PressableItem
          pressedFunction={chooseLocationHandler}
          componentStyle={styles.locationPressable}
          pressedStyle={globalStyles.pressablePressed}
        >
        
            <View style={globalStyles.detailRow}>
            <FontAwesome
              name={route.name === "Event" ? "search" : "map-marker"}
              size={16}
              color="white"
              style={{ left: 10 }}
            />
            <Text style={{ color:'white', left: 30 }}>
              {route.name === "Event" ? "View Nearby Events" : "Choose My Location"}
            </Text>
            </View>
          
        
        </PressableItem>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: 100,
    alignSelf: "center",
    borderRadius: 10,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: 'center',
    width:'50%'
  },

  locationPressable: {
    backgroundColor: Color.headerBackground,
    width:"80%",
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
    justifyContent: 'center',
    position: 'relative',
    alignItems: 'center',
    marginLeft: 40,
  }

});
