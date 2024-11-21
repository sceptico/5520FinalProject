import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, Button, ActivityIndicator, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { globalStyles } from '../Style/Styles';
import Color from '../Style/Color';
import { addDocument, updateDocument } from '../Firebase/firebaseHelper'; 
import { useRoute, useNavigation } from '@react-navigation/native';
import { auth } from '../Firebase/firebaseSetup';

export default function Sell() {
  const route = useRoute();
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('used');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false); // Local state for isEdit

  const [openCondition, setOpenCondition] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  const conditionItems = [
    { label: 'Used', value: 'used' },
    { label: 'Like New', value: 'likeNew' },
    { label: 'Brand New', value: 'brandNew' },
  ];

  const categories = [
    { label: 'Clubs', value: 'Clubs' },
    { label: 'Apparel', value: 'Apparel' },
    { label: 'Accessories', value: 'Accessories' },
    { label: 'Men', value: 'Men' },
    { label: 'Women', value: 'Women' },
    { label: 'Kids', value: 'Kids' },
  ];

  // const isEdit = route.params?.isEdit || false;
  const productId = route.params?.id;

  useEffect(() => {
    // Dynamically update isEdit when route.params changes
    setIsEdit(route.params?.isEdit || false);

    if (route.params?.isEdit) {
      setTitle(route.params.title || '');
      setDescription(route.params.description || '');
      setCondition(route.params.condition || 'used');
      setCategory(route.params.category || '');
    } else {
      resetForm(); // Reset form fields for add mode
    }
  }, [route.params]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCondition('used');
    setCategory('');
  };

  const handleSubmit = async () => {
    if (!title || !description || !condition || !category) {
      Alert.alert('Missing Fields', 'Please fill in all fields before submitting.');
      return;
    }

    const productData = {
      title,
      description,
      condition,
      category,
      createdAt: isEdit ? route.params.createdAt : new Date(),
      ownerId: auth.currentUser.uid,
    };

    setLoading(true);
    try {
      if (isEdit) {
        await updateDocument('Product', productId, productData);
        console.log('Product updated successfully!');
              // Reset `isEdit` and navigate to the ProductDetail page
      navigation.navigate('ProductDetail', { itemId: productId, isEdit: false });

      } else {
        await addDocument('Product', productData);
        console.log('Product added successfully!');
      }

      setTitle('');
      setDescription('');
      setCondition('used');
      setCategory('');

      navigation.navigate('Shop');
    } catch (error) {
      console.error('Error saving product to Firestore:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      {loading && <ActivityIndicator size="large" color={Color.saveButton} />}
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
      <View style={{ zIndex: openCategory ? 2000 : 1 }}>
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
      <View style={{ zIndex: openCondition ? 2000 : 1 }}>
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

      <Button
        title={isEdit ? 'Update Product' : 'Add Product'}
        onPress={handleSubmit}
        color={Color.saveButton}
      />
    </View>
  );
}
