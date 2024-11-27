import { FlatList, View, Text } from 'react-native'
import React from 'react'
import PressableItem from './PressableItem'
import ProductItem from './ProductItem'
import EventItem from './EventItem'
import ReminderItem from './ReminderItem'
import { globalStyles } from '../Style/Styles'

export default function ItemsList({ items, navigation, type }) {
  console.log('ItemsList items:', items)
  const renderItem = ({ item }) => {
    // Render different components based on the type
    if (type === "Reminder") {
      return (
        <PressableItem
          pressedFunction={() => {
            navigation.navigate(
              "EventDetail", {itemId: item.eventId}
            )
          }}
          componentStyle={
            {
            width:250,
            borderRadius: 5,
            padding: 5,
            alignItems:'center',
            flexDirection: 'row',
            justifyContent: 'center',
            }
          }
          >
        <ReminderItem
          reminderId={item.id} // Assuming ReminderItem uses reminderId for fetching
        />
        </PressableItem>
      );
    }

    return (
      <PressableItem
        pressedFunction={() => {
          navigation.navigate(
            type === "Product" ? "ProductDetail" : "EventDetail",
            { itemId: item.id, imageUri: item.imageUri }
          );
        }}
      >
        {type === "Product" ? (
          <ProductItem item={item} />
        ) : (
          <EventItem item={item} />
        )}
      </PressableItem>
    );
  };
  
  return (
    <View>
      {items.length > 0 ? (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => (
            <View style={globalStyles.listSeparator} />
          )}
        />
      ) : (
        <Text>No items</Text>
      )}
    </View>
  );
}