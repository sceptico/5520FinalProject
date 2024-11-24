// 

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { getItem,updateDocument } from "../Firebase/firebaseHelper"; // Import the helper function
import { globalStyles } from "../Style/Styles";
import PressableItem from "../Component/PressableItem";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Color from "../Style/Color";
import LocationManager from "../Component/LocationManager";

export default function MyAccount({ navigation }) {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        try {
          const userData = await getItem("users", currentUser.uid); // Fetch user data from Firestore
          setUser({
            email: currentUser.email,
            uid: currentUser.uid,
            ...userData, // Merge Firestore data (e.g., userName, likedProducts, photoURL)
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [auth]);

  return (
    <View style={globalStyles.formContainer}>
      {user ? (
        <>
          <View style={styles.profileContainer}>
            {/* Avatar and User Info */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
              {/* Avatar */}
              <Image
                source={
                  user.photoURL
                    ? { uri: user.photoURL }
                    : require("../assets/notice.jpg") // Replace with default avatar
                }
                style={{ width: 100, height: 100, borderRadius: 50, marginRight: 10 }}
              />

              {/* User Details */}
              <View>
                {user.userName && <Text style={styles.userName}>{user.userName}</Text>}
                <Text style={styles.userEmail}>
                  <FontAwesome name="envelope-o" size={16} color="black" style={{ left: 10 }} />{" "}
                  {user.email}
                </Text>
              </View>
            </View>

            {/* Profile Details */}
            <View style={styles.profileDetail}>
              {/* Liked Products */}
              <PressableItem
                pressedFunction={() =>
                  navigation.navigate("User Favorite", { type: "Product", userId: user.uid })
                }
                componentStyle={globalStyles.pressable}
                pressedStyle={globalStyles.pressablePressed}
              >
                <View style={{ flexDirection: "row", width: 160 }}>
                  <FontAwesome name="heart-o" size={16} color="black" style={{ left: 10 }} />
                  <Text style={{ left: 30 }}>Liked Products</Text>
                </View>
              </PressableItem>

              {/* Interested Events */}
              <PressableItem
                pressedFunction={() =>
                  navigation.navigate("User Favorite", { type: "Event", userId: user.uid })
                }
                componentStyle={globalStyles.pressable}
                pressedStyle={globalStyles.pressablePressed}
              > 
                <View style={{ flexDirection: "row", width: 160 }}>
                  <FontAwesome name="star-o" size={16} color="black" style={{ left: 10 }} />
                  <Text style={{ left: 30 }}>Interested Events</Text>
                </View>
              </PressableItem>


                {/* My Listings */}
                <PressableItem
              pressedFunction={() => {
                navigation.navigate('User Favorite', { type: 'Product', userId: user.uid, myListings: true });
              }}
              componentStyle={globalStyles.pressable}
              pressedStyle={globalStyles.pressablePressed}
            >
              <View style={{ flexDirection: 'row', width: 160 }}>
                <FontAwesome
                  name={'list-alt'}
                  size={16}
                  color={'black'}
                  style={{ left: 10 }}
                />
                <Text style={{ left: 30 }}>My Listings</Text>
              </View>
            </PressableItem>

              {/* Set Reminder */}
              <PressableItem
              pressedFunction={() => {
                navigation.navigate('User Favorite', { type: 'Product', userId: user.uid, myListings: true });
              }}
              componentStyle={globalStyles.pressable}
              pressedStyle={globalStyles.pressablePressed}
            >
              <View style={{ flexDirection: 'row', width: 160 }}>
                <FontAwesome
                  name={'bell-o'}
                  size={16}
                  color={'black'}
                  style={{ left: 10 }}
                />
                <Text style={{ left: 30 }}>My reminders</Text>
              </View>
            </PressableItem>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            {/* Edit Profile */}
            <PressableItem
              componentStyle={{
                backgroundColor: Color.headerBackground,
                width: 80,
                borderRadius: 5,
              }}
              pressedFunction={() => {
                console.log({ user });
                navigation.navigate('Edit Profile', { user });
              }}
            >
              <Text style={{ color: 'white' }}>Edit</Text>
            </PressableItem>
  
            {/* Logout */}
            <PressableItem
              componentStyle={{
                backgroundColor: Color.headerBackground,
                width: 80,
                borderRadius: 5,
              }}
              pressedFunction={() => {
                signOut(auth);
                setUser(null);
              }}
            >
              <Text style={{ color: 'white' }}>Logout</Text>
            </PressableItem>
          </View>
            </View>
          </View>

          {/* LocationManager Section */}
          <View style={styles.locationContainer}>
            <LocationManager />
          </View>
        </>
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
  profileContainer: {
    flex: 6,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
  },
  profileDetail: {
    flex: 3,
    backgroundColor: "grey",
    padding: 20,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
  },
  userName: {
    fontSize: 25,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "grey",
  },
  locationContainer: {
    flex: 2,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
  },
});
