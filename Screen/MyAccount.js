

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { getItem } from "../Firebase/firebaseHelper";
import { useRoute } from "@react-navigation/native"; // Added
import { globalStyles } from "../Style/Styles";
import PressableItem from "../Component/PressableItem";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Color from "../Style/Color";
import LocationManager from "../Component/LocationManager";

export default function MyAccount({ navigation }) {
  const route = useRoute(); // Access the route object
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (route.params?.updatedUser) {
        setUser(route.params.updatedUser);
      } else {
        fetchUserData();
      }
    });

    return unsubscribe;
  }, [navigation, route.params]);

  const fetchUserData = async () => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        const userData = await getItem("users", currentUser.uid);
        setUser({
          email: currentUser.email,
          uid: currentUser.uid,
          ...userData,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Profile Header */}
          <View style={styles.profileContainer}>
            <View style={styles.header}>
              <Image
                source={
                  user.photoURL
                    ? { uri: user.photoURL }
                    : require("../assets/notice.jpg")
                }
                style={styles.avatar}
              />
              <View>
                {user.userName && <Text style={styles.userName}>{user.userName}</Text>}
                <Text style={styles.userEmail}>
                  <FontAwesome name="envelope-o" size={16} color="black" /> {user.email}
                </Text>
              </View>
            </View>
          </View>

          {/* Profile Details */}
          <View style={styles.profileDetail}>
            <PressableItem
              pressedFunction={() =>
                navigation.navigate("User Favorite", { type: "Product", userId: user.uid })
              }
              componentStyle={styles.pressable}
              pressedStyle={globalStyles.pressablePressed}
            >
              <View style={styles.detailRow}>
                <FontAwesome name="heart-o" size={16} color="black" />
                <Text style={styles.detailText}>Liked Products</Text>
              </View>
            </PressableItem>

            <PressableItem
              pressedFunction={() =>
                navigation.navigate("User Favorite", { type: "Event", userId: user.uid })
              }
              componentStyle={styles.pressable}
              pressedStyle={globalStyles.pressablePressed}
            >
              <View style={styles.detailRow}>
                <FontAwesome name="star-o" size={16} color="black" />
                <Text style={styles.detailText}>Interested Events</Text>
              </View>
            </PressableItem>

            {/* My Listings */}
            <PressableItem
              pressedFunction={() =>
                navigation.navigate("User Favorite", { type: "Product", userId: user.uid, myListings: true })
              }
              componentStyle={styles.pressable}
              pressedStyle={globalStyles.pressablePressed}
            >
              <View style={styles.detailRow}>
                <FontAwesome name="list-alt" size={16} color="black" />
                <Text style={styles.detailText}>My Listings</Text>
              </View>
            </PressableItem>

            {/* Reminders */}
            <PressableItem
              pressedFunction={() => navigation.navigate("Reminders")}
              componentStyle={styles.pressable}
              pressedStyle={globalStyles.pressablePressed}
            >
              <View style={styles.detailRow}>
                <FontAwesome name="bell-o" size={16} color="black" />
                <Text style={styles.detailText}>My Reminders</Text>
              </View>
            </PressableItem>

            {/* Edit and Logout Buttons */}
            <View style={styles.buttonRow}>
              <PressableItem
                componentStyle={styles.button}
                pressedFunction={() => navigation.navigate("Edit Profile", { user })}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </PressableItem>
              <PressableItem
                componentStyle={styles.button}
                pressedFunction={() => {
                  signOut(auth);
                  setUser(null);
                }}
              >
                <Text style={styles.buttonText}>Logout</Text>
              </PressableItem>
            </View>
          </View>

          {/* Location Manager */}
          <View style={styles.locationContainer}>
            <LocationManager />
          </View>
        </ScrollView>
      ) : (
        <Text>Not logged in</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    padding: 20,
  },
  profileContainer: {
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "grey",
  },
  profileDetail: {
    padding: 10,
    backgroundColor:'rgba(225, 238, 214, 1)',
    borderRadius: 10,
    alignItems:'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: 'center',
    width:'50%'
  },
  detailText: {
    marginLeft:10,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width:'70%',
  },
  button: {
    backgroundColor: Color.headerBackground,
    borderRadius: 5,
    padding: 10,
    width: "40%",
  },
  buttonText: {
    color: "white",
    textAlign: 'center',
    fontSize:16,
  },
  locationContainer: {
    marginTop: 10,
  },
  pressable: {
    backgroundColor:'white',
    width:"95%",
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
    justifyContent: 'center',
    position: 'relative',
  }
});
