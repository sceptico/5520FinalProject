import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, Button, ActivityIndicator, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { globalStyles } from '../Style/Styles';
import Color from '../Style/Color';
import { addDocument, updateDocument } from '../Firebase/firebaseHelper'; 
import { useRoute, useNavigation } from '@react-navigation/native';
import { auth, storage } from '../Firebase/firebaseSetup';
import ImageManager from '../Component/ImageManager';
import { ref, uploadBytesResumable } from 'firebase/storage'

export default function Sell() {
  const route = useRoute();
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('used');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false); // Local state for isEdit
  const [imageUri, setImageUri] = useState(null)
  const [openCondition, setOpenCondition] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  const receiveImageUri = (uri) => {
    setImageUri(uri)
  }

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
  //const productId = route.params.id;
  //console.log('route.params:', route.params.id);

  useEffect(() => {
    // Dynamically update isEdit when route.params changes
    setIsEdit(route.params?.isEdit || false);

    if (route.params?.isEdit) {
      setTitle(route.params.title || '');
      setDescription(route.params.description || '');
      setCondition(route.params.condition || 'used');
      setCategory(route.params.category || '');
      setImageUri(route.params.imageUri || '')
    } else {
      resetForm(); // Reset form fields for add mode
    }
  }, [route.params]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCondition('used');
    setCategory('');
    setIsEdit(false);
    setImageUri('')
  };

  async function handleImageData(uri){
    try {
      let uploadUrl = ""
      const response = await fetch(uri)
      const blob = await response.blob()
      const imageName = uri.substring(uri.lastIndexOf('/') + 1);
      const imageRef = await ref(storage, `images/${imageName}`)
      const uploadResult = await uploadBytesResumable(imageRef, blob);
      console.log(uploadResult.metadata.fullPath)
      uploadUrl = uploadResult.metadata.fullPath
      return uploadUrl
    } catch (error) {
      console.log(error)
    }
  }

const handleSubmit = async () => {
  if (!title || !description || !condition || !category || !imageUri) {
    Alert.alert('Missing Fields', 'Please fill in all fields before submitting.');
    return;
  }

  setLoading(true);

  try {
    let uploadedImageUrl = imageUri;
    if (imageUri) {
      uploadedImageUrl = await handleImageData(imageUri);
    }

    const productData = {
      title,
      description,
      condition,
      category,
      createdAt: isEdit ? route.params.createdAt : new Date(),
      ownerId: auth.currentUser.uid,
      imageUri: uploadedImageUrl, // Use the uploaded image URL
    };

    if (isEdit) {
      await updateDocument('Product', route.params.id, productData);
      console.log('Product updated successfully!');
      navigation.navigate('ProductDetail', { itemId: route.params.id });
    } else {
      await addDocument('Product', productData);
      console.log('Product added successfully!');
      navigation.navigate('Shop');
    }

    resetForm();
  } catch (error) {
    console.error('Error saving product to Firestore:', error);
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={globalStyles.container}>
      {loading && <ActivityIndicator size="large" color={Color.saveButton} />}
      <ImageManager receiveImageUri={receiveImageUri} />
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
