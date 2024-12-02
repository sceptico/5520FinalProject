

import { Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { globalStyles } from '../Style/Styles';
import ItemsList from '../Component/ItemsList';
import { getItemsByCategory, fetchAllDocuments } from '../Firebase/firebaseHelper';
import FilterSortBar from '../Component/FilterSortBar';

export default function ProductList({ navigation, route, mode = 'default' }) {
  const { mainCategory = '', subCategory = '' } = route?.params || {}; // Safely handle missing params
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filters, setFilters] = useState([]);
  const sortOptions = [
    { label: 'Price: Low to High', value: 'priceAsc' },
    { label: 'Price: High to Low', value: 'priceDesc' },
    { label: 'Uploaded Time: Newest First', value: 'timeDesc' },
    { label: 'Uploaded Time: Oldest First', value: 'timeAsc' },
  ];

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getItems();
    });
    return unsubscribe;
  } , [navigation]);

  useEffect(() => {
    if (mode === 'default') {
      if (mainCategory) {
        setFilters([
          { label: 'All', value: '' },
          { label: 'Men', value: 'Men' },
          { label: 'Women', value: 'Women' },
          { label: 'Kids', value: 'Kids' },
          { label: 'Used', value: 'used' },
          { label: 'Brand New', value: 'brandNew' },
        ]);
      } else if (subCategory) {
        setFilters([
          { label: 'All', value: '' },
          { label: 'Used', value: 'used' },
          { label: 'Brand New', value: 'brandNew' },
        ]);
      } else {
        setFilters([
          { label: 'All', value: '' },
          { label: 'Used', value: 'used' },
          { label: 'Brand New', value: 'brandNew' },
        ]);
      }
    }
  }, [mainCategory, subCategory, mode]);

  const getItems = async () => {
    try {
      let data;
      if (mode === 'latest') {
        data = await fetchAllDocuments('Product', null, {
          orderBy: 'createdAt',
          direction: 'desc',
        });
      } else {
        data = await getItemsByCategory('Product', { mainCategory, subCategory });
      }
      setItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error(`Error getting items: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getItems();
  }, [mode, mainCategory, subCategory]);

  const handleFilterChange = (filterValue) => {
    if (!filterValue) {
      setFilteredItems(items);
    } else if (['Men', 'Women', 'Kids'].includes(filterValue)) {
      setFilteredItems(items.filter((item) => item.subCategory === filterValue));
    } else {
      setFilteredItems(items.filter((item) => item.condition === filterValue));
    }
  };

  const handleSortChange = (sortValue) => {
    const sorted = [...filteredItems];
    if (sortValue === 'priceAsc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'priceDesc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortValue === 'timeDesc') {
      sorted.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortValue === 'timeAsc') {
      sorted.sort((a, b) => a.createdAt - b.createdAt);
    }
    setFilteredItems(sorted);
  };

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <View>
        <Text>No items found.</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.listContainer}>
      {mode === 'default' && (
        <FilterSortBar
          filters={filters}
          sortOptions={sortOptions}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />
      )}
      <ItemsList items={filteredItems} navigation={navigation} type="Product" />
    </View>
  );
}
