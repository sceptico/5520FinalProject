import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
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
import Signup from './Component/Signup';
import Login from './Component/Login';
import RequireAuth from './Component/RequireAuth';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


// MainTabs component
function MainTabs() {
  const [user, setUser] = useState(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
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
      <Header />
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerBackTitleVisible: false,
          headerStyle: { backgroundColor: Color.headerBackground },
        }}
      >
        <Stack.Screen
          name="Main Tabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="Product List" component={ProductList} />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetail}
          options={{ title: 'Product Details' }}
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
