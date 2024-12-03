
// import { StyleSheet, Image, View, Alert, Modal, Text } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import * as ImagePicker from 'expo-image-picker';
// import { storage } from '../Firebase/firebaseSetup';
// import { ref, getDownloadURL } from 'firebase/storage';
// import PressableItem from './PressableItem';
// import { Ionicons } from '@expo/vector-icons';

// export default function ImageManager({ receiveImageUri, initialUri }) {
//   const [response, requestPermission] = ImagePicker.useCameraPermissions();
//   const [imageUri, setImageUri] = useState(initialUri || '');
//   const [modalVisible, setModalVisible] = useState(false);

//   async function verifyPermission() {
//     if (response.granted) {
//       return true;
//     }
//     const permissionResponse = await requestPermission();
//     return permissionResponse.granted;
//   }

//   // useEffect(() => {
//   //   if (initialUri) {
//   //     const fetchUrl = async () => {
//   //       const url = await fetchDownloadUrl(initialUri);
//   //       setImageUri(url);
//   //     };
//   //     fetchUrl();
//   //   } else {
//   //     setImageUri('');
//   //   }
//   // }, [initialUri]);

//   useEffect(() => {
//     if (initialUri) {
//       if (typeof initialUri === 'string') {
//         // If initialUri is a Firebase Storage path
//         const fetchUrl = async () => {
//           try {
//             const url = await fetchDownloadUrl(initialUri);
//             setImageUri(url);
//           } catch (error) {
//             console.error('Error fetching download URL:', error);
//           }
//         };
//         fetchUrl();
//       } else if (typeof initialUri === 'object' && initialUri.uri) {
//         // If initialUri is a local file reference
//         setImageUri(initialUri.uri);
//       } else {
//         setImageUri('');
//       }
//     } else {
//       setImageUri('');
//     }
//   }, [initialUri]);

//   async function fetchDownloadUrl(path) {
//     try {
//       const imageRef = ref(storage, path);
//       const url = await getDownloadURL(imageRef);
//       return url;
//     } catch (error) {
//       console.error('Error fetching download URL:', error);
//     }
//   }

//   async function takeImageHandler() {
//     try {
//       const hasPermission = await verifyPermission();
//       if (!hasPermission) {
//         Alert.alert(
//           'Permission required',
//           'You need to grant camera permissions to use this feature',
//           [{ text: 'Okay' }]
//         );
//         return;
//       }
//       const result = await ImagePicker.launchCameraAsync({
//         allowsEditing: true,
//       });
//       if (!result.canceled) {
//         setImageUri(result.assets[0].uri);
//         receiveImageUri(result.assets[0].uri);
//         setModalVisible(false);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async function pickImageHandler() {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//       });
//       if (!result.canceled) {
//         setImageUri(result.assets[0].uri);
//         receiveImageUri(result.assets[0].uri);
//         setModalVisible(false);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   return (
//     <View style={{ margin: 10 }}>

//       {/* Gallery Button */}
//       <PressableItem
//         pressedFunction={() => setModalVisible(true)}
//         componentStyle={styles.galleryButton}
//         pressedStyle={styles.galleryButtonPressed}
//       >
//         <Ionicons name="images" size={30} color="white" />
//       </PressableItem>

//       {imageUri && (
//         <Image
//           source={{ uri: imageUri }}
//           style={styles.image}
//           alt="preview of the image user has taken"
//         />
//       )}

//       {/* Modal for Choosing Action */}
//       <Modal visible={modalVisible} transparent animationType="slide">
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Choose an Action</Text>
//             <PressableItem
//               pressedFunction={takeImageHandler}
//               componentStyle={styles.modalButton}
//               pressedStyle={styles.modalButtonPressed}
//             >
//               <Ionicons name="camera" size={25} color="white" />
//               <Text style={styles.modalButtonText}>Take a Picture</Text>
//             </PressableItem>
//             <PressableItem
//               pressedFunction={pickImageHandler}
//               componentStyle={styles.modalButton}
//               pressedStyle={styles.modalButtonPressed}
//             >
//               <Ionicons name="images" size={25} color="white" />
//               <Text style={styles.modalButtonText}>Pick from Gallery</Text>
//             </PressableItem>
//             <PressableItem
//               pressedFunction={() => setModalVisible(false)}
//               componentStyle={[styles.modalButton,
//                  { backgroundColor: 'rgba(0, 0, 11, 0.41)' }]}  
//               pressedStyle={styles.modalButtonPressed}
//             >
//               <Text style={styles.modalButtonText}>Cancel</Text>
//             </PressableItem>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

import { StyleSheet, Image, View, Alert, Modal, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../Firebase/firebaseSetup';
import { ref, getDownloadURL } from 'firebase/storage';
import PressableItem from './PressableItem';
import { Ionicons } from '@expo/vector-icons';

export default function ImageManager({ receiveImageUri, initialUri }) {
  const [response, requestPermission] = ImagePicker.useCameraPermissions();
  const [imageUri, setImageUri] = useState(initialUri || '');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (initialUri) {
      if (typeof initialUri === 'string') {
        const fetchUrl = async () => {
          try {
            const url = await fetchDownloadUrl(initialUri);
            setImageUri(url);
          } catch (error) {
            console.error('Error fetching download URL:', error);
          }
        };
        fetchUrl();
      } else if (typeof initialUri === 'object' && initialUri.uri) {
        setImageUri(initialUri.uri);
      } else {
        setImageUri('');
      }
    } else {
      setImageUri('');
    }
  }, [initialUri]);

  async function fetchDownloadUrl(path) {
    try {
      const imageRef = ref(storage, path);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error('Error fetching download URL:', error);
    }
  }

  async function takeImageHandler() {
    try {
      const hasPermission = await verifyPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission required',
          'You need to grant camera permissions to use this feature',
          [{ text: 'Okay' }]
        );
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
      });
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        receiveImageUri(result.assets[0].uri);
        setModalVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function pickImageHandler() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        receiveImageUri(result.assets[0].uri);
        setModalVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function verifyPermission() {
    if (response.granted) {
      return true;
    }
    const permissionResponse = await requestPermission();
    return permissionResponse.granted;
  }

  return (
    <View style={{ margin: 10 }}>
      {/* Gallery Button */}
      <PressableItem
        pressedFunction={() => setModalVisible(true)}
        componentStyle={styles.galleryButton}
        pressedStyle={styles.galleryButtonPressed}
      >
        <Ionicons name="images" size={30} color="white" />
      </PressableItem>

      {/* Image Preview and Delete Button */}
      {imageUri && (
        <View style={{ alignItems: 'left', marginVertical: 10 }}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            alt="preview of the image user has taken"
          />
          <PressableItem
            pressedFunction={() => {
              setImageUri(''); // Clear the image URI state
              receiveImageUri(''); // Notify the parent component
            }}
            componentStyle={{
              marginTop: 10,
              backgroundColor: 'red',
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete Photo</Text>
          </PressableItem>
        </View>
      )}

      {/* Modal for Choosing Action */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose an Action</Text>
            <PressableItem
              pressedFunction={takeImageHandler}
              componentStyle={styles.modalButton}
              pressedStyle={styles.modalButtonPressed}
            >
              <Ionicons name="camera" size={25} color="white" />
              <Text style={styles.modalButtonText}>Take a Picture</Text>
            </PressableItem>
            <PressableItem
              pressedFunction={pickImageHandler}
              componentStyle={styles.modalButton}
              pressedStyle={styles.modalButtonPressed}
            >
              <Ionicons name="images" size={25} color="white" />
              <Text style={styles.modalButtonText}>Pick from Gallery</Text>
            </PressableItem>
            <PressableItem
              pressedFunction={() => setModalVisible(false)}
              componentStyle={[styles.modalButton, { backgroundColor: 'rgba(0, 0, 11, 0.41)' }]}
              pressedStyle={styles.modalButtonPressed}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </PressableItem>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    margin: 10,
  },

  galleryButton: {
    backgroundColor: 'rgba(70, 130, 180, 0.3)',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  galleryButtonPressed: {
    backgroundColor: '#4682B4',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(70, 130, 180, 0.9)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
    justifyContent: 'center',
  },
  modalButtonPressed: {
    backgroundColor: '#4682B4',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
});
