import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import { background, primary } from '../utils/constants';

const CLOUDINARY_UPLOAD_PRESET = 'poojamarg'; // Make sure this is unsigned
const CLOUDINARY_CLOUD_NAME = 'dkkgikjzr';

const CategoryUploadScreen = () => {
  const [categoryTitle, setCategoryTitle] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    launchImageLibrary({ mediaType: 'photo' }, async response => {
      if (response.didCancel || response.errorCode) {
        return;
      }
      const asset = response.assets[0];
      setImage(asset);
    });
  };

  const uploadToCloudinary = async () => {
    if (!image?.uri) {
      Alert.alert('Error', 'Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: image.uri,
      type: image.type,
      name: image.fileName || 'upload.jpg',
    });
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        },
      );

      const data = await res.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('Upload Error', error.message);
    }
  };

  const handleSubmit = async () => {
    if (!categoryTitle) {
      Alert.alert('Validation', 'Please enter a category name.');
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadToCloudinary();
      if (!imageUrl) return;

      await firestore().collection('categories').add({
        title: categoryTitle,
        imageUrl,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Success', 'Category added successfully!');
      setCategoryTitle('');
      setImage(null);
    } catch (error) {
      console.log('Firestore Error:', error);
      Alert.alert('Error', 'Failed to save category.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Category Title"
        value={categoryTitle}
        onChangeText={setCategoryTitle}
      />

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.image} />
        ) : (
          <Text style={{ color: '#555' }}>Pick Category Image</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>
          {uploading ? 'Uploading...' : 'Submit Category'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CategoryUploadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
    padding: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  imagePicker: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    height: 200,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  button: {
    backgroundColor: primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
