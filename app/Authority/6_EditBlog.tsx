
import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, Text } from 'react-native'; // Importing Text here
import { useRouter, useLocalSearchParams } from 'expo-router';
import { db } from '../../constants/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker'; // Importing the image picker

const EditBlog = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [blog, setBlog] = useState({
    title: '',
    content: '',
    image: '', // This will hold the image URI
  });

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      const docRef = doc(db, 'Blogs', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const docData = docSnap.data();
        setBlog({
          title: docData.Title,
          content: docData.Content,
          image: docData.imageurl, // Fetch the image URL from Firestore
        });
      }
    };

    fetchBlog();
  }, [id]);

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'You need to grant permission to access your gallery.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setBlog({ ...blog, image: result.assets[0].uri }); // Set the selected image URI
    }
  };

  const handleSave = async () => {
    if (!id) return;
    const docRef = doc(db, 'Blogs', id as string);
    try {
      await updateDoc(docRef, {
        Title: blog.title,
        Content: blog.content,
        imageurl: blog.image, // Store the URI of the selected image
      });
      Alert.alert('Success', 'Blog updated successfully');
      router.back();
    } catch (error) {
      console.error('Error updating blog: ', error);
      Alert.alert('Error', 'There was an issue updating the blog');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Blog Title"
        value={blog.title}
        onChangeText={(text) => setBlog({ ...blog, title: text })}
      />
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Blog Content"
        value={blog.content}
        onChangeText={(text) => setBlog({ ...blog, content: text })}
        multiline
      />

      {/* Replace image URL input with the image picker */}
      <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
        <Text style={styles.imageButtonText}>Pick an Image</Text>
      </TouchableOpacity>

      {blog.image ? (
        <Image source={{ uri: blog.image }} style={styles.selectedImage} />
      ) : (
        <Text>No image selected</Text>
      )}

      {/* Save button */}


      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.imageButtonText}>Save Changes</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 156,
    
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  textarea: {
    height: 100,
  },
  imageButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#D1FFBD',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  imageButtonText: {
    fontSize: 16,
    color: 'black',
  },
  selectedImage: {
    width: 150,
    height: 150,
    marginVertical: 10,
    borderRadius: 10,
  },
  saveButton: {
    width: '80%',
    height: 50,
    left: 30,
    backgroundColor: 'white',
    borderRadius: 25,
    borderColor: '#D1FFBD',
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
});

export default EditBlog;

