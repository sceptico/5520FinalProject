import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, Button, ActivityIndicator, Alert,ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { globalStyles } from '../Style/Styles';
import Color from '../Style/Color';
import { addDocument, updateDocument } from '../Firebase/firebaseHelper'; 
import { useRoute, useNavigation } from '@react-navigation/native';
import { auth, storage } from '../Firebase/firebaseSetup';
import ImageManager from '../Component/ImageManager';
import { ref, uploadBytesResumable } from 'firebase/storage'
import PressableItem from '../Component/PressableItem';

export default function Sell() {
  const route = useRoute();
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('used');
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false); // Local state for isEdit
  const [imageUri, setImageUri] = useState('../assets/club.jpg');
  const [openCondition, setOpenCondition] = useState(false);
  const [openMainCategory, setOpenMainCategory] = useState(false);
  const [openSubCategory, setOpenSubCategory] = useState(false);
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [price, setPrice] = useState('');

  const [errors, setErrors] = useState({
    title: '',
    price: '',
    description: '',
  });

  const receiveImageUri = (uri) => {
    setImageUri(uri)
  }

  const conditionItems = [
    { label: 'Used', value: 'used' },
    { label: 'Like New', value: 'likeNew' },
    { label: 'Brand New', value: 'brandNew' },
  ];

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

  useEffect(() => {
    // Dynamically update isEdit when route.params changes
    setIsEdit(route.params?.isEdit || false);

    if (route.params?.isEdit) {
      setTitle(route.params.title || '');
      setDescription(route.params.description || '');
      setCondition(route.params.condition || 'used');
      setMainCategory(route.params.mainCategory || '');
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



  // Validation functions
  const validateTitle = (text) => {
    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount > 10) {
      setErrors((prev) => ({ ...prev, title: 'Title cannot exceed 10 words.' }));
    } else {
      setErrors((prev) => ({ ...prev, title: '' }));
    }
    setTitle(text);
  };

  const validatePrice = (text) => {
    if (!/^\d+$/.test(text)) {
      setErrors((prev) => ({ ...prev, price: 'Price must be a valid integer.' }));
    } else {
      setErrors((prev) => ({ ...prev, price: '' }));
    }
    setPrice(text);
  };

  const validateDescription = (text) => {
    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount < 10) {
      setErrors((prev) => ({ ...prev, description: 'Description must be at least 10 words.' }));
    } else {
      setErrors((prev) => ({ ...prev, description: '' }));
    }
    setDescription(text);
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
      if (errors.title || errors.price || errors.description) {
      Alert.alert('Validation Error', 'Please fix the errors before submitting.');
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
      navigation.navigate('ProductDetail', { itemId: route.params.id, imageUri: uploadedImageUrl });
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
    <ScrollView contentContainerStyle={{flexGrow:1}}>
      <View style={globalStyles.container}>
       {loading && <ActivityIndicator size="large" color={Color.saveButton} />}


      <Text style={globalStyles.label}>Title</Text>
      <TextInput
        style={globalStyles.input}
        value={title}
        // onChangeText={setTitle}
        onChangeText={validateTitle}
  
        placeholder="Enter product title"
        textSize={14}
      />
        {errors.title ? <Text style={globalStyles.errorText}>{errors.title}</Text> : null}

<Text style={globalStyles.label}>Price</Text>
      <TextInput
        style={globalStyles.input}
        value={price}
        textSize={14}
        // onChangeText={setPrice}
        onChangeText={validatePrice}
        placeholder="Enter product price"
      />
      {errors.price ? <Text style={globalStyles.errorText}>{errors.price}</Text> : null}

      <Text style={globalStyles.label}>Description</Text>
      <TextInput
        style={[globalStyles.input, globalStyles.textArea]}
        value={description}
        // onChangeText={setDescription}
        onChangeText={validateDescription}
        placeholder="Enter product description"
        textSize={14}
        multiline
        numberOfLines={4}
      />
      {errors.description ? <Text style={globalStyles.errorText}>{errors.description}</Text> : null}

      <Text style={globalStyles.label}>Main Category</Text>
      <View style={{ width:'100%', zIndex: openMainCategory ? 2000 : 1 }}>
        <DropDownPicker
          open={openMainCategory}
          value={mainCategory}
          items={mainCategories}
          setOpen={setOpenMainCategory}
          setValue={setMainCategory}
          placeholder="Select main category"
          textStyle={{
            textAlign: 'left', 
            color: condition ? 'black' : 'gray', 
            fontSize: 14, 
          }}
          style={globalStyles.picker}
        />
      </View>

      <Text style={globalStyles.label}>Subcategory</Text>
<View style={{ width: '100%', zIndex: openSubCategory ? 2000 : 1 }}>
  <DropDownPicker
    open={openSubCategory}
    value={subCategory}
    items={subCategories}
    setOpen={setOpenSubCategory}
    setValue={setSubCategory}
    placeholder="Select a subcategory"
    textStyle={{
      textAlign: 'left', 
      color: condition ? 'black' : 'gray', 
      fontSize: 14, 
    }}
    style={globalStyles.picker}
  />
</View>


      <Text style={globalStyles.label}>Condition</Text>
      <View style={{ width:'100%', zIndex: openCondition ? 2000 : 1 }}>
        <DropDownPicker
          open={openCondition}
          value={condition}
          items={conditionItems}
          setOpen={setOpenCondition}
          setValue={setCondition}
          placeholder="Select condition"
          // textStyle={{ fontSize: 16 }}
          style={globalStyles.picker}
         textStyle={{
            textAlign: 'left', 
            color: condition ? 'black' : 'gray', 
            fontSize: 14, 
          }}
        />
      </View>

<Text style={globalStyles.label}>Add Photos</Text>
<ImageManager 
  receiveImageUri={receiveImageUri} 
  initialUri={isEdit && imageUri ? { uri: imageUri } : require('../assets/club.jpg')} 
/>
<PressableItem
      pressedFunction={handleSubmit}
      componentStyle={globalStyles.largePressable}
      pressedStyle={globalStyles.pressablePressed}
    >
       <View style={globalStyles.detailRow}>
       <Text style={{ color:'white', left:100, fontSize: 16 }}>

        {isEdit ? 'Update' : 'Add Product'}
      </Text>
       </View>

    </PressableItem>
    
    {/* Cancel Button */}
{isEdit && (
  <PressableItem
 
      pressedFunction={() => {
        resetForm(); // Reset the form state
        navigation.navigate(route.params?.previousScreen || 'ProductDetail', {
        itemId: route.params?.id,
        imageUri: imageUri,
       
      });
    
      }}
    componentStyle={[globalStyles.largePressable, { backgroundColor: 'gray', marginTop: 1 }]} // Gray background for Cancel button
    pressedStyle={globalStyles.pressablePressed}
  >
    <View style={globalStyles.detailRow}>
      <Text style={{ color: 'white', left: 100, fontSize: 16 }}>
        Cancel
      </Text>
    </View>
  </PressableItem>
  
)}
</View>
    </ScrollView>
  );
}


