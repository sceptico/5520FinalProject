// import {
//   Alert,
//   Button,
//   Dimensions,
//   Image,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import * as Location from "expo-location";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import { readOneDoc, updateDB } from "../Firebase/firebaseHelper";
// import { auth } from "../Firebase/firebaseSetup";
// import PressableItem from "./PressableItem";
// import { globalStyles } from "../Style/Styles";
// import FontAwesome from "react-native-vector-icons/FontAwesome";

// const windowWidth = Dimensions.get("window").width;

// export default function LocationManager() {
//   const [location, setLocation] = useState(null);
//   const [response, requestPermission] = Location.useForegroundPermissions();
//   const navigation = useNavigation();
//   const route = useRoute();
//   const [isLocationSelected, setIsLocationSelected] = useState(false);

//   // Fetch location automatically on mount
//   useEffect(() => {
//     async function fetchLocation() {
//       const hasPermission = await verifyPermission();
//       if (!hasPermission) {
//         Alert.alert("You need to give location permission to view the map.");
//         return;
//       }
//       try {
//         const locationResponse = await Location.getCurrentPositionAsync();
//         setLocation({
//           latitude: locationResponse.coords.latitude,
//           longitude: locationResponse.coords.longitude,
//         });
//       } catch (err) {
//         console.log("Error fetching location: ", err);
//       }
//     }

//     // If there's a location passed in route params, use it; otherwise, fetch location
//     if (route.params && route.params.location) {
//       setLocation(route.params.location);
//       setIsLocationSelected(true);
//     } else {
//       fetchLocation();
//     }
//   }, [route]);

//   async function verifyPermission() {
//     try {
//       if (response?.granted) {
//         return true;
//       }
//       const permissionResponse = await requestPermission();
//       return permissionResponse.granted;
//     } catch (err) {
//       console.log("verifyPermission error: ", err);
//     }
//   }

//   function chooseLocationHandler(location) {
//     navigation.navigate("Map", {
//       location, // Pass the current location
//     });
//   }
  
//   function saveLocationHandler() {
//     try {
//       updateDB(auth.currentUser.uid, { location }, "users");
//       navigation.navigate("Home");
//     } catch (err) {
//       console.log("Error saving location: ", err);
//     }
//   }

//   return (
//     <View>
//       {location && (
//         <Image
//           source={{
//             uri: `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:L%7C${location.latitude},${location.longitude}&key=${process.env.EXPO_PUBLIC_mapsApiKey}`,
//           }}
//           style={styles.map}
//           alt="static map"
//         />
//       )}
    
//       {/* <PressableItem
//         pressedFunction={chooseLocationHandler}
//         componentStyle={globalStyles.pressable}
//         pressedStyle={globalStyles.pressablePressed}
//       >
//         <View style={{ flexDirection: "row", width: 200 }}>
//           <FontAwesome
//             name="map-marker"
//             size={16}
//             color="black"
//             style={{ left: 10 }}
//           />
//           <Text style={{ left: 30 }}>Choose My Location</Text>
//         </View>
//       </PressableItem> */}

//       {/* Conditional PressableItem */}
//       {isLocationSelected ? (
//         <PressableItem
//           pressedFunction={saveLocationHandler}
//           componentStyle={globalStyles.pressable}
//           pressedStyle={globalStyles.pressablePressed}
//         >
//           <View style={{ flexDirection: "row", width: 200 }}>
//             <FontAwesome
//               name="save"
//               size={16}
//               color="black"
//               style={{ left: 10 }}
//             />
//             <Text style={{ left: 30 }}>Save My Location</Text>
//           </View>
//         </PressableItem>
//       ) : (
//         <PressableItem
//           pressedFunction={chooseLocationHandler}
//           componentStyle={globalStyles.pressable}
//           pressedStyle={globalStyles.pressablePressed}
//         >
//           <View style={{ flexDirection: "row", width: 200 }}>
//             <FontAwesome
//               name="map-marker"
//               size={16}
//               color="black"
//               style={{ left: 10 }}
//             />
//             <Text style={{ left: 30 }}>Choose My Location</Text>
//           </View>
//         </PressableItem>
//       )}



//       {/* <Button
//         disabled={!location}
//         title="Save My Location"
//         onPress={saveLocationHandler}
//       /> */}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   map: { 
//     width: "100%", // Use the full width of the parent container
//     height: 100, // Adjust height as needed
//     alignSelf: "center", // Center the map horizontally
//     borderRadius: 10, 
//   },

// });

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
import { updateDocument } from "../Firebase/firebaseHelper";
import { auth } from "../Firebase/firebaseSetup";
import PressableItem from "./PressableItem";
import { globalStyles } from "../Style/Styles";
import FontAwesome from "react-native-vector-icons/FontAwesome";

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
    });
  }

  function saveLocationHandler() {
    try {
      updateDocument(auth.currentUser.uid, { location }, "users");
      Alert.alert("Success", "Your location has been saved.");
      console.log("Before setting isLocationSelected:", isLocationSelected);
      setIsLocationSelected(false); // Reset to show "Choose My Location"
      console.log("After setting isLocationSelected:", isLocationSelected);
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
          componentStyle={globalStyles.pressable}
          pressedStyle={globalStyles.pressablePressed}
        >
          <View style={{ flexDirection: "row", width: 200 }}>
            <FontAwesome
              name="map-marker"
              size={16}
              color="black"
              style={{ left: 10 }}
            />
            <Text style={{ left: 30 }}>Choose My Location</Text>
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
});
