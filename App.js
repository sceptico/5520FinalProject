import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import Color from './Style/Color';
import Header from './Component/Header';

import React from 'react';
// import { Home, Sell, Shop, MyAccount, NewListing, ProductList } from './navigations/Screens';
import Home from './Screen/Home';
// console.log(Home);
import Sell from './Screen/Sell';
import Shop from './Screen/Shop';
import MyAccount from './Screen/MyAccount';
import NewListing from './Screen/NewListing';
import ProductList from './Screen/ProductList';
import Event from './Screen/Event';
import ProductDetail from './Screen/ProductDetail';
import UserFavorite from './Screen/UserFavorite';
import EventDetail from './Screen/EventDetail';


const Stack = createNativeStackNavigator(); // Create a stack navigator
const Tab = createBottomTabNavigator(); // Create a bottom tab navigator


// MainTabs component that contains the tab navigator
function MainTabs() {
  return (
    <Tab.Navigator // Tab navigator for the main screens
      initialRouteName="ParTee Up"
      screenOptions={({ route }) => ({
        headerTitleAlign: 'left',
        tabBarStyle: { backgroundColor: Color.headerBackground, },
        headerStyle: { backgroundColor: Color.pageBackground,
          elevation: 0, // Remove shadow on Android
          shadowOpacity: 0, // Remove shadow on iOS
          borderTopWidth: 0, // Remove top border if any
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
            // iconName ='plus';
            iconColor = Color.tradeLogo;
          }
          else if (route.name === 'Event') {
            iconName = 'calendar';
          }
          else if (route.name === 'My Account') {
            iconName = 'user';
          }
          return <FontAwesome5 name={iconName} size={size} color={iconColor} />;
        },
      })}
    >
      <Tab.Screen name="ParTee Up" component={Home} />
      <Tab.Screen name="Shop" component={Shop} />
      <Tab.Screen name="Trade" component={Sell} />
      <Tab.Screen name="Event" component={Event} />
      <Tab.Screen name="My Account" component={MyAccount} />

    </Tab.Navigator>
  );
}



//stack navigator for the main screens
export default function App() {

  return (
    <NavigationContainer>
      <Header />
      <Stack.Navigator 
          initialRouteName="MainTabs"
          screenOptions={{
            headerBackTitleVisible: false,
            headerStyle: { backgroundColor: Color.headerBackground },
          }}>
          <Stack.Screen
            name="Main Tabs"  // MainTab represents the tab navigator
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="New Listing" 
            component={NewListing} 
            options={{ title: 'New Listing' }}
          />
          <Stack.Screen 
            name="Product List" 
            component={ProductList} 
            // options={{ title: 'Product' }}
          />
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
            name="User Favorite"
            component={UserFavorite}
            options={{ title: 'User Favorites' }}
          />
          <Stack.Screen 
              name="My Account" 
              component={MyAccount} 
              options={{ 
                title: 'My Account',
                headerTintColor: Color.headerText, // Consistent text color
                headerStyle: { backgroundColor: Color.headerBackground }, // Consistent background
                headerTitleStyle: { fontWeight: 'bold' }, // Consistent title style
              }}
            />
          
        </Stack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
