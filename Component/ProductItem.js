import { Text, View, StyleSheet, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, db, storage} from '../Firebase/firebaseSetup';
import { doc, updateDoc, arrayUnion, arrayRemove,onSnapshot } from 'firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getDownloadURL, ref } from 'firebase/storage';
import { isLikedByUser } from '../Firebase/firebaseHelper';

export default function ProductItem({ item }) {
  const currentUser = auth.currentUser; // Get the current user
  const [liked, setLiked] = useState(false);
  const [downloadURL, setDownloadURL] = useState('')

  useEffect(() => {
    async function getImageDownloadURL() {
      try {
        if (item.imageUri) {
          const imageRef = ref(storage, item.imageUri)
          const downloadImageURL = await getDownloadURL(imageRef)
          console.log('downloadImageURL', downloadImageURL)
          setDownloadURL(downloadImageURL)
        } 
        } catch (error) {
        console.log(error)
    }
    }
    getImageDownloadURL()
  }, [item])

  // useEffect(() => {
  //   async function getImageDownloadURL() {
  //     try {
  //       if (imageUri && typeof imageUri === 'string') {
  //         const imageRef = ref(storage, imageUri);
  //         const downloadImageURL = await getDownloadURL(imageRef);
  //         setImageUri(downloadImageURL); // Update imageUri with the valid download URL
  //       } else {
  //         console.log('Invalid or undefined imageUri:', imageUri);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching download URL:', error);
  //     }
  //   }
  //   getImageDownloadURL();
  // }, [item]);
  


  useEffect(() => {
    if (!currentUser) return;
  
    const userRef = doc(db, 'users', currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const likedProducts = userData.likedProducts || [];
        setLiked(likedProducts.includes(item.id));
      }
    });
  
    return () => unsubscribe(); // Cleanup listener on unmount
  }, [currentUser, item.id]);
  

  const handleLike = async ({ productId, itemId }) => {
    if (!currentUser) {
      Alert.alert('Please login to like this product');
      return;
    }
  
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const id = productId || itemId;
  
      if (liked) {
        await updateDoc(userRef, {
          likedProducts: arrayRemove(id),
        });
      } else {
        await updateDoc(userRef, {
          likedProducts: arrayUnion(id),
        });
      }
  
      setLiked(!liked); // Toggle state
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };
  

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Product Image */}
        <View style={styles.photoContainer}>
          <Image
            source={downloadURL ? { uri: downloadURL } : require('../assets/club.jpg')}
            style={styles.photo}
          />
        </View>
  
        {/* Product Details */}
        <View style={styles.right}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>${item.price}</Text>
          <Text style={styles.description} numberOfLines={1}>
            {item.description}
          </Text>
          <Text style={styles.condition}>Condition: {item.condition}</Text>
        </View>

        {/* Like Button */}
        <View style={styles.likeWrapper}>
          <FontAwesome
            name={liked ? 'heart' : 'heart-o'}
            size={24}
            color={liked ? 'red' : 'black'}
            onPress={() => handleLike({ productId: item.id })}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '95%',
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginVertical: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  container: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    padding: 15,
    alignItems: 'center',
  },
  photoContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  right: {
    flex: 1,
    paddingLeft: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  condition: {
    fontSize: 12,
    color: '#888',
  },
  likeWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 15,
    top: 2,
    backgroundColor: 'transparent',

  },
  price: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    
  },
});
