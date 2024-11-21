// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { initializeAuth, getReactNativePersistence } from "firebase/auth";

import { getStorage } from "firebase/storage";
import { getAuth } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:process.env.EXPO_PUBLIC_apiKey,
  authDomain:process.env.EXPO_PUBLIC_authDomain,
  projectId:process.env.EXPO_PUBLIC_projectId,
  storageBucket:process.env.EXPO_PUBLIC_storageBucket,
  messagingSenderId:process.env.EXPO_PUBLIC_messagingSenderId,
  appId:process.env.EXPO_PUBLIC_appId

}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// export const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage)
// });
export const auth = getAuth(app);
export const storage = getStorage(app);