import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PressableItem = (props) => {
  return (
    <Pressable 
      onPress={props.pressedFunction}
    //   onLongPress={props.onLongPress}
    //   onPressIn={props.onPressIn}
    //   onPressOut={props.onPressOut}
      android_ripple={{ color: 'lightgrey', borderless: false }} // Android ripple effect
      
      //add a function to style the button when pressed
      // The style prop is an object that contains the styles to be applied to the button
      // The function returns an array of styles that are applied to the button, the order of the array matters
      // The bottom style will override the top style
      style={({ pressed }) => [
        styles.default, // default style
        props.componentStyle, // style from the parent component
        pressed && styles.defaultPressedStyle, // pressed default style
        pressed && props.pressedStyle, // pressed style
      ]}
    >
      {props.children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  default: {
    borderRadius: 5,
    padding: 5,  
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  defaultPressedStyle: {
    backgroundColor: 'beige',
    opacity: 0.2,
    alignContent: 'center',
  },

  buttonText: {
    color: 'rgba(245, 238, 11, 0.8)',
    fontSize: 20,
  },

});

export default PressableItem;
