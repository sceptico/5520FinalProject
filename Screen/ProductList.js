import { Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../Style/Styles'
import ItemsList from '../Component/ItemsList'
import { getItemsByCategory } from '../Firebase/firebaseHelper'
import FilterSortBar from '../Component/FilterSortBar'


export default function ProductList({navigation, route}) {
  const { mainCategory, subCategory } = route.params || {};
  console.log(route.params)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true);
  const [filteredItems, setFilteredItems] = useState([])
  const [filters, setFilters] = useState([]);
  const sortOptions = [
    { label: "Price: Low to High", value: "priceAsc" },
    { label: "Price: High to Low", value: "priceDesc" },
    { label: "Uploaded Time: Newest First", value: "timeDesc" },
    { label: "Uploaded Time: Oldest First", value: "timeAsc" },
  ];

  useEffect(() => {
    if (mainCategory) {
      // Set filters dynamically based on subcategories of the mainCategory
      setFilters([
        { label: "All", value: "" },
        { label: "Men", value: "Men" },
        { label: "Women", value: "Women" },
        { label: "Kids", value: "Kids" },
        { label: "Used", value: "used" },
        { label: "Brand New", value: "brandNew" },
      ]);
    } else if (subCategory) {
      // Set filters dynamically for conditions when subCategory is provided
      setFilters([
        { label: "All", value: "" },
        { label: "Used", value: "used" },
        { label: "Brand New", value: "brandNew" },
      ]);
    } else {
      // Default filters
      setFilters([
        { label: "All", value: "" },
        { label: "Used", value: "used" },
        { label: "Brand New", value: "brandNew" },
      ]);
    }
  }, [mainCategory, subCategory]);


  if (!mainCategory && !subCategory) {
    return (
      <View>
        <Text>No category selected</Text>
      </View>
    );
  }

//   useEffect(() => {
//     navigation.setOptions({ title: categoryName });
// }, [navigation, categoryName]);

//   const getItems = async () => {
//     try {
//       const data = await getItemsByCategory('Product', categoryName)
//       setItems(data)
//     } catch (error) {
//       console.log("Error getting items: ${error}")
//     }
//   }

//     useEffect(() => {
//       const unsubscribe = navigation.addListener('focus', () => {
//         getItems()
//       })
//       return unsubscribe
//     }, [navigation])


useEffect(() => {
  navigation.setOptions({
    title: `${mainCategory || ''}${subCategory ? `  ${subCategory}` : ''}`,
  });
}, [navigation, mainCategory, subCategory]);

// Fetch items based on categories
const getItems = async () => {
  try {
    const data = await getItemsByCategory('Product', { mainCategory, subCategory });
    setItems(data);
    setFilteredItems(data); // Initialize filteredItems with all items
  } catch (error) {
    console.error(`Error getting items: ${error}`);
  } finally {
    setLoading(false);
  }
};

// Add listener to fetch items on screen focus
useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    getItems();
  });
  return unsubscribe;
}, [navigation, mainCategory, subCategory]);

  // Filter items based on selected filter
  const handleFilterChange = (filterValue) => {
    if (!filterValue) {
      setFilteredItems(items); // Show all items when "All" is selected
    } else if (["Men", "Women", "Kids"].includes(filterValue)) {
      const filtered = items.filter((item) => item.subCategory === filterValue);
      setFilteredItems(filtered);
    } else {
      const filtered = items.filter((item) => item.condition === filterValue);
      setFilteredItems(filtered);
    }
  };

  // Sort items based on selected sort option
  const handleSortChange = (sortValue) => {
    const sorted = [...filteredItems];
    if (sortValue === "priceAsc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortValue === "priceDesc") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortValue === "timeDesc") {
      sorted.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortValue === "timeAsc") {
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
      <Text>No items found for {mainCategory || ''} {subCategory || ''}.</Text>
    </View>
  );
}


  return (
    <View style={globalStyles.listContainer}>
        <FilterSortBar
        filters={filters}
        sortOptions={sortOptions}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />
      {/* <Text>{categoryName}</Text> */}
      <ItemsList items={items} navigation={navigation} type='Product' />
    </View>
  )
}