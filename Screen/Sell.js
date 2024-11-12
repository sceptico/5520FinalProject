import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, Button } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { globalStyles } from '../Style/Styles';
import Color from '../Style/Color';
import { addDocument, updateDocument } from '../Firebase/firebaseHelper'; 
import { useRoute, useNavigation } from '@react-navigation/native';

export default function Sell() {
  const route = useRoute();
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('used');
  const [category, setCategory] = useState('');
  const [createdAt, setCreatedAt] = useState(new Date());

  const [openCondition, setOpenCondition] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  // Define item condition options
  const conditionItems = [
    { label: 'Used', value: 'used' },
    { label: 'Like New', value: 'likeNew' },
    { label: 'Brand New', value: 'brandNew' },
  ];

  // Define categories
  const categories = [
    { label: 'Clubs', value: 'Clubs' },
    { label: 'Apparel', value: 'Apparel' },
    { label: 'Accessories', value: 'Accessories' },
    { label: 'Men', value: 'Men' },
    { label: 'Women', value: 'Women' },
    { label: 'Kids', value: 'Kids' },
  ];

  // Check if in edit mode
  const isEdit = route.params?.isEdit || false;
  const productId = route.params?.id;

  // Pre-fill fields if in edit mode
  useEffect(() => {
    if (isEdit && route.params) {
      setTitle(route.params.title || '');
      setDescription(route.params.description || '');
      setCondition(route.params.condition || 'used');
      setCategory(route.params.category || '');
    }
  }, [isEdit, route.params]);

  // Handle add or update product
  const handleSubmit = async () => {
    if (!title || !description || !condition || !category) {
      console.log('Please fill in all fields.');
      return;
    }

    const productData = {
      title,
      description,
      condition,
      category,
      // createdAt: isEdit ? route.params.createdAt : new Date(),
    };

    try {
      if (isEdit) {
        // Update existing product
        await updateDocument('Product', productId, productData);
        console.log('Product updated successfully!');
      } else {
        // Add new product
        await addDocument('Product', productData);
        console.log('Product added successfully!');
      }

      // Reset fields after submission
      setTitle('');
      setDescription('');
      setCondition('used');
      setCategory('');

      // Navigate back to the previous screen
      navigation.goBack();
    } catch (error) {
      console.error('Error saving product to Firestore:', error);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.label}>Title</Text>
      <TextInput
        style={globalStyles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter product title"
      />

      <Text style={globalStyles.label}>Description</Text>
      <TextInput
        style={[globalStyles.input, globalStyles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter product description"
        multiline
        numberOfLines={4}
      />

      <Text style={globalStyles.label}>Category</Text>
      <View style={{ zIndex: openCategory ? 1000 : 1, elevation: openCategory ? 5 : 0 }}>
        <DropDownPicker
          open={openCategory}
          value={category}
          items={categories}
          setOpen={setOpenCategory}
          setValue={setCategory}
          placeholder="Select a category"
          style={globalStyles.picker}
        />
      </View>

      <Text style={globalStyles.label}>Condition</Text>
      <View style={{ zIndex: openCondition ? 1000 : 1, elevation: openCondition ? 5 : 0 }}>
        <DropDownPicker
          open={openCondition}
          value={condition}
          items={conditionItems}
          setOpen={setOpenCondition}
          setValue={setCondition}
          placeholder="Select condition"
          style={globalStyles.picker}
        />
      </View>

      <Button title={isEdit ? 'Update' : 'All Set'} onPress={handleSubmit} color={Color.saveButton} />
    </View>
  );
}
