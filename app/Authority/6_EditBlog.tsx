// app/6_EditBlog.tsx
import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { db } from '../../constants/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const EditBlog = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [blog, setBlog] = useState({
    title: '',
    content: '',
    image: '',
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
          image: docData.imageurl,
        });
      }
    };

    fetchBlog();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    const docRef = doc(db, 'Blogs', id as string);
    try {
      await updateDoc(docRef, {
        Title: blog.title,
        Content: blog.content,
        imageurl: blog.image,
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
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={blog.image}
        onChangeText={(text) => setBlog({ ...blog, image: text })}
      />
      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
});

export default EditBlog;
