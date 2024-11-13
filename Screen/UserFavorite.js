import { Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { globalStyles } from '../Style/Styles'
import ItemsList from '../Component/ItemsList'
import { getUserLikesOrInterests } from '../Firebase/firebaseHelper'


export default function UserFavorite({navigation, route}) {
  const { type, userId } = route.params; // 'Product' or 'Event'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const data = await getUserLikesOrInterests(userId, type);
      setItems(data);
    } catch (error) {
      console.log(`Error fetching ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [type, userId]);

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Text>Loading {type === 'Product' ? 'liked products' : 'interested events'}...</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      {items.length > 0 ? (
        <ItemsList items={items} navigation={navigation} />
      ) : (
        <Text>No {type === 'Product' ? 'liked products' : 'interested events'}</Text>
      )}
    </View>
  );
}
