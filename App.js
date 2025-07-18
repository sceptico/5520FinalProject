import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import Color from './Style/Color';
import Header from './Component/Header';
import { auth } from './Firebase/firebaseSetup';
import { onAuthStateChanged } from 'firebase/auth';

import Home from './Screen/Home';
import Sell from './Screen/Sell';
import Shop from './Screen/Shop';
import MyAccount from './Screen/MyAccount';
import ProductList from './Screen/ProductList';
import Event from './Screen/Event';
import ProductDetail from './Screen/ProductDetail';
import EventDetail from './Screen/EventDetail';
import Signup from './Component/Signup';
import EditProfile from './Screen/EditProfile';
import Login from './Component/Login';
import RequireAuth from './Component/RequireAuth';
import UserFavorite from './Screen/UserFavorite'
import Map from './Component/Map';
import UserReminders from './Component/UserReminders';
import * as Notifications from 'expo-notifications'

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert:true
    }
  }
})

// MainTabs component
function MainTabs() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  // Prevent flickering during the initial loading
  if (initializing) {
    return null;
  }

  return (
    <Tab.Navigator
      initialRouteName="ParTee Up"
      screenOptions={({ route }) => ({
        headerTitleAlign: 'left',
        tabBarStyle: { backgroundColor: Color.headerBackground },
        header: ({ navigation, route }) => (
          <Header
            navigation={navigation}
            route={route}
            user={user}
          />
        ),
        headerStyle: {
          backgroundColor: Color.pageBackground,
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 0,
        },
        headerTintColor: Color.headerBackground,
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarActiveTintColor: Color.activeIcon,
        tabBarInactiveTintColor: Color.inactiveIcon,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          let iconColor = color;
          if (route.name === 'ParTee Up') {
            iconName = 'home';
          } else if (route.name === 'Shop') {
            iconName = 'shopify';
          } else if (route.name === 'Trade') {
            iconName = 'dollar-sign';
            iconColor = Color.tradeLogo;
          } else if (route.name === 'Event') {
            iconName = 'calendar';
          } else if (route.name === 'My Account') {
            iconName = 'user';
          }
          return <FontAwesome5 name={iconName} size={size} color={iconColor} />;
        },

      })}
    >
      <Tab.Screen name="ParTee Up" component={Home} />
      <Tab.Screen name="Shop" component={Shop} />
      <Tab.Screen
        name="Trade"
        component={user ? Sell : RequireAuth}
  
      />
      <Tab.Screen name="Event" component={Event} />
      <Tab.Screen
        name="My Account"
        component={user ? MyAccount : RequireAuth}
  
      />
    </Tab.Navigator>
  );
}

// App Component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerBackTitleVisible: false,
          headerTintColor: Color.headerText,
          headerStyle: { backgroundColor: Color.headerBackground },
        }}
      >
        <Stack.Screen
          name="Main Tabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="Product List" 
        component={ProductList} />

        <Stack.Screen
          name="ProductDetail"
          component={ProductDetail}
          options={{ title: 'Product Details' }}
        />
        
        <Stack.Screen
          name="EventDetail"
          component={EventDetail}
          options={{ title: 'Event Details' }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: 'Login' }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ title: 'Signup' }}
        />
        <Stack.Screen
          name="User Favorite"
          component={UserFavorite}
          options={{ headershown:false }}
        />
        <Stack.Screen
          name="Trade"
          component={Sell}
          options={{ headershown:false }}
        />
        
        <Stack.Screen
          name="Edit Profile"
          component={EditProfile}
          options={{ title: 'Edit Profile' }}
        />
        <Stack.Screen
          name="Map"
          component={Map}
          options={{ title: 'Map' }}
        />
        <Stack.Screen
          name="Reminders"
          component={UserReminders}
          options={{ title: 'My Reminders'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
