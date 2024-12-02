// 

import { Image, StyleSheet, Text, View, Button, ActivityIndicator, Alert, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getItem, deleteDocument, isLikedByUser } from '../Firebase/firebaseHelper';
import { auth, db, storage } from '../Firebase/firebaseSetup';
import { doc, getDoc } from 'firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { arrayRemove, arrayUnion, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import defaultImage from '../assets/club.jpg';
import PressableItem from '../Component/PressableItem';


export default function ProductDetail() {
  const { currentUser } = auth;
  const navigation = useNavigation();
  const route = useRoute();
  const itemId = route.params.itemId;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [downloadURL, setDownloadURL] = useState('');
  const [ownerName, setOwnerName] = useState('Anonymous'); // State to store owner name

  useEffect(() => {
    async function getImageDownloadURL() {
      try {
        if (route.params && route.params.imageUri) {
          const imageRef = ref(storage, route.params.imageUri);
          const downloadImageURL = await getDownloadURL(imageRef);
          setDownloadURL(downloadImageURL);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getImageDownloadURL();
  }, [route.params]);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const fetchedItem = await getItem('Product', itemId);
        setItem(fetchedItem);
      } catch (error) {
        console.error('Error fetching item:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [route.params]);

  useEffect(() => {
    const fetchOwnerName = async () => {
      if (item && item.ownerId) {
        try {
          const userRef = doc(db, 'users', item.ownerId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setOwnerName(userData.userName || 'Anonymous');
          }
        } catch (error) {
          console.error('Error fetching owner data:', error);
        }
      }
    };
    fetchOwnerName();
  }, [item]);

  useEffect(() => {
    const checkLiked = async () => {
      if (!currentUser) {
        setLiked(false);
        return;
      }
      try {
        const isLiked = await isLikedByUser(itemId, currentUser.uid, 'Product');
        setLiked(isLiked);
      } catch (error) {
        console.error('Error checking if product is liked:', error);
      }
    };
    checkLiked();
  }, [itemId, currentUser]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!item) {
    return <Text>Item not found</Text>;
  }

  const { title, description, createdAt, condition, price } = item;

  const handleLike = async () => {
    if (!currentUser) {
      Alert.alert('Please login to like this product');
      navigation.navigate('Login');
      return;
    }
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      if (liked) {
        await updateDoc(userRef, {
          likedProducts: arrayRemove(itemId),
        });
      } else {
        await updateDoc(userRef, {
          likedProducts: arrayUnion(itemId),
        });
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Error liking product:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await deleteDocument('Product', itemId);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting item:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleUpdate = () => {
    if (!item) {
      console.error('No item data available to update.');
      return;
    }

    navigation.navigate('Trade', {
      title: item.title,
      description: item.description,
      createdAt: item.createdAt,
      condition: item.condition,
      category: item.category,
      imageUri: item.imageUri,
      isEdit: true,
      id: itemId,
    });
  };

  const isOwnedByCurrentUser = currentUser && item?.ownerId === currentUser.uid;

  return (
    <View style={styles.container}>
      {/* Product Image */}
      <Image 
        source={downloadURL ? { uri: downloadURL } : defaultImage} 
        style={styles.image} 
      />
  
      <View style={styles.content}>
        {/* Title and Absolute Icons */}
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          {isOwnedByCurrentUser && (
            <>
              {/* Edit Icon */}
              <PressableItem 
                pressedFunction={handleUpdate} 
                componentStyle={[styles.iconButton, styles.editIcon]} 
                pressedStyle={styles.pressedIconButton}
              >
                <FontAwesome name="pencil" size={24} color="black" />
              </PressableItem>
              {/* Trash Bin Icon */}
              <PressableItem 
                pressedFunction={handleDelete} 
                componentStyle={[styles.iconButton, styles.deleteIcon]} 
                pressedStyle={styles.pressedIconButton}
              >
                <FontAwesome name="trash" size={24} color="black" />
              </PressableItem>
            </>
          )}
          {/* Like Icon */}
          <PressableItem 
            pressedFunction={handleLike} 
            componentStyle={[styles.iconButton, styles.likeIcon]} 
            pressedStyle={styles.pressedIconButton}
          >
            <FontAwesome name={liked ? 'heart' : 'heart-o'} size={24} color={liked ? 'red' : 'black'} />
          </PressableItem>
        </View>
  
        {/* Other Product Details */}
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.info}>Listed Date: {new Date(createdAt.seconds * 1000).toLocaleDateString()}</Text>
        <Text style={styles.info}>Condition: {condition}</Text>
        <Text style={styles.info}>Price: ${price}</Text>
        <Text style={styles.info}>Seller: {ownerName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '50%',
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  titleRow: {
    position: 'relative', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  iconButton: {
    padding: 8,
    position: 'absolute', // Positions icons absolutely within the row
  },
  editIcon: {
    right: 80, // Position relative to the right edge
    top: 4, 
  },
  deleteIcon: {
    right: 40, // Position relative to the right edge
    top: 4, 
  },
  likeIcon: {
    right: 0, // Position relative to the right edge
    top: 4, 
  },
  pressedIconButton: {
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
});
