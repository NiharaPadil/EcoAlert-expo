import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db } from '../../constants/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const CreateBlog = ({ navigation}:any) => {
    const router=useRouter();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = async () => {
    if (!title || !author || !content || !image) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await addDoc(collection(db, 'Blogs'), {
        Title: title,
        Author: author,
        Content: content,
        TimeStamp: new Date(),
        imageurl: image,
      });

      Alert.alert('Success', 'Blog created successfully!');
      router.back() // Navigate back to the previous screen
    } catch (error:any) {
      Alert.alert('Error', 'Failed to create blog: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Author</Text>
      <TextInput
        style={styles.input}
        value={author}
        onChangeText={setAuthor}
      />

      <Text style={styles.label}>Content</Text>
      <TextInput
        style={styles.input}
        multiline
        value={content}
        onChangeText={setContent}
      />

      <Text style={styles.label}>Image URL</Text>
      <TextInput
        style={styles.input}
        value={image}
        onChangeText={setImage}
      />

      <Button title="Create Blog" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    height: '100%',
    //make it a little bit down
    
  },
  label: {
    marginTop: 26,
    marginBottom: 1,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
});

export default CreateBlog;
