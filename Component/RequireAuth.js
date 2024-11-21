import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import PressableItem from './PressableItem';
import Color from '../Style/Color';

export default function RequireAuth({ navigation }) {
  const signInHandler = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/notice.png')} 
        style={styles.image}
      />
      <Text style={styles.message}>
      Please log in to your ParTeeUp account to continue.
      </Text>
      <PressableItem 
        pressedFunction={signInHandler} 
        componentStyle={styles.buttonContainer} 
        pressedStyle={styles.buttonContainerPressed}
      >
        <Text style={styles.buttonText}>Login</Text>
      </PressableItem>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Color.pageBackground, // Set background color for the page
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    width: 150, // Set the width of the image
    height: 150, // Set the height of the image
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%', // Set the width of the button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: Color.headerBackground,
    alignItems: 'center',
  },
  buttonContainerPressed: {
    backgroundColor: Color.buttonPressedBackground,
    opacity: 0.8,
  },
  buttonText: {
    color: Color.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
