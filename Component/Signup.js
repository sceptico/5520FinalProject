// import { TextInput, Text, View, Button, Alert, TouchableOpacity } from 'react-native';
// import { useState, useLayoutEffect } from 'react';
// import React from 'react';
// import { db } from '../Firebase/firebaseSetup';
// import { doc, setDoc } from 'firebase/firestore';
// import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
// import { globalStyles } from '../Style/Styles';
// import { FontAwesome5 } from '@expo/vector-icons';
// import Color from '../Style/Color';

// export default function Signup({ navigation }) {
//   const [userName, setUserName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [passwordWarning, setPasswordWarning] = useState('');
//   const [confirmPasswordWarning, setConfirmPasswordWarning] = useState('');
//   const auth = getAuth();

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerLeft: () => (
//         <TouchableOpacity
//           onPress={() => navigation.navigate('Main Tabs')}
//           style={{ marginLeft: 15 }}
//         >
//           <FontAwesome5 name="arrow-left" size={24} color={Color.tradeLogo} />
//         </TouchableOpacity>
//       ),
//     });
//   }, [navigation]);

//   const userNameHandler = (text) => {
//     setUserName(text);
//   };

//   const emailHandler = (text) => {
//     setEmail(text);
//   };

//   const passwordHandler = (text) => {
//     setPassword(text);
//     if (!validatePassword(text)) {
//       setPasswordWarning(
//         'Password must be at least 6 characters long and include one uppercase letter, one lowercase letter, one number, and one special character.'
//       );
//     } else {
//       setPasswordWarning(''); // Clear warning if password is valid
//     }
//   };

//   const confirmPasswordHandler = (text) => {
//     setConfirmPassword(text);
//     if (text !== password) {
//       setConfirmPasswordWarning('Passwords do not match.');
//     } else {
//       setConfirmPasswordWarning(''); // Clear warning if passwords match
//     }
//   };

//   const validatePassword = (password) => {
//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;
//     return passwordRegex.test(password);
//   };

//   const registerHandler = async () => {
//     try {
//       if (userName.length < 3) {
//         Alert.alert('Username must be at least 3 characters long');
//         return;
//       }
//       if (password !== confirmPassword) {
//         Alert.alert('Passwords do not match');
//         return;
//       }
//       if (email.length === 0 || password.length === 0 || confirmPassword.length === 0) {
//         Alert.alert('Please fill in all fields');
//         return;
//       }
//       if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//         Alert.alert('Please enter a valid email address');
//         return;
//       }
//       const userCred = await createUserWithEmailAndPassword(auth, email, password);
//       console.log('userCred', userCred);

//       await writeUserDataToFirestore(userCred.user.uid, userCred.user.email, userCred.user.userName);

//       Alert.alert('User registered successfully');
//       navigation.navigate('Main Tabs', { screen: 'My Account' });
//     } catch (err) {
//       if (err.code === 'auth/weak-password') {
//         Alert.alert('Password must be at least 6 characters long');
//         return;
//       }
//       Alert.alert(err.message);
//     }
//   };

//   const writeUserDataToFirestore = async (userId, email) => {
//     try {
//       const userDocRef = doc(db, 'users', userId);
//       await setDoc(userDocRef, {
//         userName: userName,
//         email: email,
//         uid: userId,
//         likedProducts: [], // Initialize liked products array
//       });

//       console.log('User data written to Firestore');
//     } catch (error) {
//       console.error('Error writing user data to Firestore:', error);
//     }
//   };

//   const loginHandler = () => {
//     navigation.replace('Login');
//   };

//   return (
//     <View style={globalStyles.authPage}>
//       <TextInput
//         style={globalStyles.input}
//         placeholder="Username"
//         onChangeText={userNameHandler}
//       />  
//       <TextInput
//         style={globalStyles.input}
//         placeholder="Email"
//         onChangeText={emailHandler}
//       />
//       <TextInput
//         style={globalStyles.input}
//         placeholder="Password"
//         onChangeText={passwordHandler}
//         secureTextEntry={true}
//       />
//       {passwordWarning ? (
//         <Text style={{ color: 'red', marginBottom: 10 }}>{passwordWarning}</Text>
//       ) : null}
//       <TextInput
//         style={globalStyles.input}
//         placeholder="Confirm Password"
//         onChangeText={confirmPasswordHandler}
//         secureTextEntry={true}
//       />
//       {confirmPasswordWarning ? (
//         <Text style={{ color: 'red', marginBottom: 10 }}>{confirmPasswordWarning}</Text>
//       ) : null}
//       <View>
//         <Button title="Register" onPress={registerHandler} />
//         <Button title="Already Registered? Login" onPress={loginHandler} />
//       </View>
//     </View>
//   );
// }

import {
  TextInput,
  Text,
  View,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useState, useLayoutEffect } from "react";
import React from "react";
import { db } from "../Firebase/firebaseSetup";
import { doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import { globalStyles } from "../Style/Styles";
import { FontAwesome5 } from "@expo/vector-icons";
import Color from "../Style/Color";
import { writeUserDataToFirestore } from "../Firebase/firebaseHelper";

export default function Signup({ navigation }) {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordWarning, setPasswordWarning] = useState("");
  const [confirmPasswordWarning, setConfirmPasswordWarning] = useState("");
  const auth = getAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Main Tabs")}
          style={{ marginLeft: 15 }}
        >
          <FontAwesome5 name="arrow-left" size={24} color={Color.tradeLogo} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const userNameHandler = (text) => setUserName(text);

  const emailHandler = (text) => setEmail(text);

  const passwordHandler = (text) => {
    setPassword(text);
    if (!validatePassword(text)) {
      setPasswordWarning(
        "Password must be at least 6 characters long and include one uppercase letter, one lowercase letter, one number, and one special character."
      );
    } else {
      setPasswordWarning("");
    }
  };

  const confirmPasswordHandler = (text) => {
    setConfirmPassword(text);
    if (text !== password) {
      setConfirmPasswordWarning("Passwords do not match.");
    } else {
      setConfirmPasswordWarning("");
    }
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;
    return passwordRegex.test(password);
  };

  const registerHandler = async () => {
    try {
      if (userName.length < 3) {
        Alert.alert("Username must be at least 3 characters long");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Passwords do not match");
        return;
      }
      if (email.length === 0 || password.length === 0 || confirmPassword.length === 0) {
        Alert.alert("Please fill in all fields");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        Alert.alert("Please enter a valid email address");
        return;
      }

      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      console.log("userCred", userCred);

      await writeUserDataToFirestore(userCred.user.uid, userCred.user.email, userName,null);

      Alert.alert("User registered successfully");
      navigation.navigate("Main Tabs", { screen: "My Account" });
    } catch (err) {
      if (err.code === "auth/weak-password") {
        Alert.alert("Password must be at least 6 characters long");
        return;
      }
      Alert.alert(err.message);
    }
  };

  // const writeUserDataToFirestore = async (userId, email, displayName) => {
  //   try {
  //     const userDocRef = doc(db, "users", userId);
  //     await setDoc(userDocRef, {
  //       userName: displayName,
  //       email: email,
  //       uid: userId,
  //       photoURI: null, // Set photoURI to null initially
  //       likedProducts: [], // Initialize liked products array
  //     });

  //     console.log("User data written to Firestore");
  //   } catch (error) {
  //     console.error("Error writing user data to Firestore:", error);
  //   }
  // };

  const loginHandler = () => navigation.replace("Login");

  return (
    <View style={globalStyles.authPage}>
      <TextInput
        style={globalStyles.input}
        placeholder="Username"
        onChangeText={userNameHandler}
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Email"
        onChangeText={emailHandler}
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Password"
        onChangeText={passwordHandler}
        secureTextEntry={true}
      />
      {passwordWarning ? (
        <Text style={{ color: "red", marginBottom: 10 }}>{passwordWarning}</Text>
      ) : null}
      <TextInput
        style={globalStyles.input}
        placeholder="Confirm Password"
        onChangeText={confirmPasswordHandler}
        secureTextEntry={true}
      />
      {confirmPasswordWarning ? (
        <Text style={{ color: "red", marginBottom: 10 }}>
          {confirmPasswordWarning}
        </Text>
      ) : null}
      <View>
        <Button title="Register" onPress={registerHandler} />
        <Button title="Already Registered? Login" onPress={loginHandler} />
      </View>
    </View>
  );
}
