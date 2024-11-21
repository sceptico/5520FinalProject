import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getItem, deleteDocument, isProductLikedByUser } from '../Firebase/firebaseHelper'; // Adjust the path to your helper function
import { Alert } from 'react-native';
import { auth, db } from '../Firebase/firebaseSetup';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';



export default function ProductDetail() {
  const { currentUser } = auth; // get the current user after auth implementation
  const navigation = useNavigation();
  const route = useRoute();
  const { itemId } = route.params;
  const { ownerId } = route.params;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false); // State to track if the product is liked by the user

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const fetchedItem = await getItem('Product', itemId); // 'product' is the collection name
        setItem(fetchedItem);
      } catch (error) {
        console.error('Error fetching item:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId, route.params]);

  useEffect(() => {
    const checkLiked = async () => {
      // Check if the product is liked by the current user
      if (!currentUser) {
        setLiked(false);
      }
      try {
        const isLiked = await isProductLikedByUser(itemId, currentUser.uid);
        console.log('itemId:', itemId, 'isLiked:', isLiked);
        setLiked(isLiked);
      } catch (error) {
        console.error('Error checking if product is liked:', error);
      }
    }
    checkLiked();
  }, [itemId, currentUser]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!item) {
    return <Text>Item not found</Text>;
  }

  const { title, description, listedDate, condition } = item;

  const handleLike = async () => {
    // push the likedProduct to the user's likedProducts array
    // and update the user document in the 'users' collection
    // prompts the user to login if not authenticated
    if (!currentUser) {
      Alert.alert('Please login to like this product');
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
  }

  const handleUpdate = () => {
    navigation.navigate('Trade', { 
      title: item.title, 
      description: item.description, 
      listedDate: item.listedDate, 
      condition: item.condition, 
      category: item.category,
      isEdit: true,   // Trigger edit mode
      id: itemId      // Pass the item ID to allow updating this specific product
    });

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
              await deleteDocument('Product', itemId); // Await the delete action
              console.log('Item deleted successfully');
              navigation.goBack(); // Navigate back only after deletion completes
            } catch (error) {
              console.error('Error deleting item:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  
  const isOwnedByCurrentUser = currentUser && item?.ownerId === currentUser.uid;
    

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.date}>Listed Date: {listedDate}</Text>
      <Text style={styles.condition}>Condition: {condition}</Text>
      {isOwnedByCurrentUser && (
        <>
      <Button title="Update" onPress={handleUpdate} />
      <Button title="Delete" onPress={handleDelete} />
      </>
      )}  
      <FontAwesome
        name={liked ? 'heart' : 'heart-o'}
        size={24}
        color={liked ? 'red' : 'black'}
        onPress={handleLike}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  condition: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
});