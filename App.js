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
console.log(Home);
import Sell from './Screen/Sell';
import Shop from './Screen/Shop';
import MyAccount from './Screen/MyAccount';
import NewListing from './Screen/NewListing';
import ProductList from './Screen/ProductList';


const Stack = createNativeStackNavigator(); // Create a stack navigator
const Tab = createBottomTabNavigator(); // Create a bottom tab navigator


// MainTabs component that contains the tab navigator
function MainTabs() {
  return (
    <Tab.Navigator // Tab navigator for the main screens
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerTitleAlign: 'center',
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
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Shop') {
            iconName = 'shopify';
          } else if (route.name === 'Sell') {
            iconName = 'dollar-sign';
          }
          else if (route.name === 'MyAccount') {
            iconName = 'user';
          }
          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Shop" component={Shop} />
      <Tab.Screen name="Sell" component={Sell} />
      <Tab.Screen name="MyAccount" component={MyAccount} />

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
            name="MainTabs"  // MainTab represents the tab navigator
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="NewListing" 
            component={NewListing} 
            options={{ title: 'New Listing' }}
          />
          <Stack.Screen 
            name="Product List" 
            component={ProductList} 
            options={{ title: 'Product' }}
          />
          <Stack.Screen 
              name="MyAccount" 
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
      
      

    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>

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
