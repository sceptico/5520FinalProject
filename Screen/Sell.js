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
  // const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false); // Local state for isEdit
  const [imageUri, setImageUri] = useState('../assets/club.jpg');
  const [openCondition, setOpenCondition] = useState(false);
  // const [openCategory, setOpenCategory] = useState(false);
  const [openMainCategory, setOpenMainCategory] = useState(false);
  const [openSubCategory, setOpenSubCategory] = useState(false);
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [price, setPrice] = useState('');

  const receiveImageUri = (uri) => {
    setImageUri(uri)
  }

  const conditionItems = [
    { label: 'Used', value: 'used' },
    { label: 'Like New', value: 'likeNew' },
    { label: 'Brand New', value: 'brandNew' },
  ];

  // const categories = [
  //   { label: 'Clubs', value: 'Clubs' },
  //   { label: 'Apparel', value: 'Apparel' },
  //   { label: 'Accessories', value: 'Accessories' },
  //   { label: 'Men', value: 'Men' },
  //   { label: 'Women', value: 'Women' },
  //   { label: 'Kids', value: 'Kids' },
  // ];
  const mainCategories = [
    { label: 'Clubs', value: 'Clubs' },
    { label: 'Apparel', value: 'Apparel' },
    { label: 'Accessories', value: 'Accessories' },
  ];
  
  const subCategories = [
    { label: 'Men', value: 'Men' },
    { label: 'Women', value: 'Women' },
    { label: 'Kids', value: 'Kids' },
  ];

  // const isEdit = route.params?.isEdit || false;
  //const productId = route.params.id;
  //console.log('route.params:', route.params);

  useEffect(() => {
    // Dynamically update isEdit when route.params changes
    setIsEdit(route.params?.isEdit || false);

    if (route.params?.isEdit) {
      setTitle(route.params.title || '');
      setDescription(route.params.description || '');
      setCondition(route.params.condition || 'used');
      setMainCategory(route.params.category || '');
      setSubCategory(route.params.subCategory || '');
      setImageUri(route.params.imageUri || '../assets/club.jpg')
      setPrice(route.params.price ||  '');
    } else {
      resetForm(); // Reset form fields for add mode
    }
  }, [route.params]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCondition('used');
    setMainCategory('');
    setSubCategory('');
    setIsEdit(false);
    setImageUri('../assets/club.jpg')
    setPrice('');
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
  if (!title || !description || !condition || !mainCategory || !subCategory || !price ||(!imageUri && !isEdit)) {
    Alert.alert('Missing Fields', 'Please fill in all fields before submitting.');
    return;
  }

  setLoading(true);

  try {

    let uploadedImageUrl = imageUri;
    if (imageUri) {
      uploadedImageUrl = await handleImageData(imageUri);
      console.log('upload image', uploadedImageUrl)
      }

    const productData = {
      title,
      description,
      condition,
      mainCategory,
      subCategory,
      price,
      createdAt: isEdit ? route.params.createdAt : new Date(),
      ownerId: auth.currentUser.uid,
      imageUri: uploadedImageUrl || '../assets/club.jpg'
    };

    if (isEdit) {
      await updateDocument('Product', route.params.id, productData);
      console.log('Product updated successfully!');
      navigation.navigate('ProductDetail', { itemId: route.params.id, imageUri: route.params.imageUri });
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
      <ImageManager receiveImageUri={receiveImageUri} initialUri={isEdit ? imageUri : ""} />
      <Text style={globalStyles.label}>Title</Text>
      <TextInput
        style={globalStyles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter product title"
      />

<Text style={globalStyles.label}>Price</Text>
      <TextInput
        style={globalStyles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Enter product price"
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

      {/* <Text style={globalStyles.label}>Category</Text>
      <View style={{ width:'80%', zIndex: openCategory ? 2000 : 1 }}>
        <DropDownPicker
          open={openCategory}
          value={category}
          items={categories}
          setOpen={setOpenCategory}
          setValue={setCategory}
          placeholder="Select a category"
          style={globalStyles.picker}
        />
      </View> */}

      <Text style={globalStyles.label}>Main Category</Text>
      <View style={{ width:'80%', zIndex: openMainCategory ? 2000 : 1 }}>
        <DropDownPicker
          open={openMainCategory}
          value={mainCategory}
          items={mainCategories}
          setOpen={setOpenMainCategory}
          setValue={setMainCategory}
          placeholder="Select main category"
          style={globalStyles.picker}
        />
      </View>

      <Text style={globalStyles.label}>Subcategory</Text>
<View style={{ width: '80%', zIndex: openSubCategory ? 2000 : 1 }}>
  <DropDownPicker
    open={openSubCategory}
    value={subCategory}
    items={subCategories}
    setOpen={setOpenSubCategory}
    setValue={setSubCategory}
    placeholder="Select a subcategory"
    style={globalStyles.picker}
  />
</View>


      <Text style={globalStyles.label}>Condition</Text>
      <View style={{ width:'80%', zIndex: openCondition ? 2000 : 1 }}>
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
