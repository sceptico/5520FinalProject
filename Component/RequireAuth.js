import { StyleSheet, Text, View, Button, Image } from 'react-native';
import React from 'react';
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
        You need to sign in to access this page. 
       
      </Text>
      <View style={styles.buttonContainer}>

        <Button title="Login" onPress={signInHandler} />
      </View>
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
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    width: 150, // Set the desired width of the image
    height: 150, // Set the desired height of the image
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
