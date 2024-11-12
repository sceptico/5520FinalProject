import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getItem,deleteDocument } from '../Firebase/firebaseHelper'; // Adjust the path to your helper function
import { Alert } from 'react-native';



export default function ProductDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { itemId } = route.params;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

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
  }, [itemId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!item) {
    return <Text>Item not found</Text>;
  }

  const { title, description, listedDate, condition } = item;

  const handleUpdate = () => {
    navigation.navigate('Trade', { 
      title: item.title, 
      description: item.description, 
      listedDate: item.listedDate, 
      condition: item.condition, 
      // createdAt: item.createdAt,
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
  
    

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.date}>Listed Date: {listedDate}</Text>
      <Text style={styles.condition}>Condition: {condition}</Text>
      <Button title="Update" onPress={handleUpdate} />
      <Button title="Delete" onPress={handleDelete} />
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