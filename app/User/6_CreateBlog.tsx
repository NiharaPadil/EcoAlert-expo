import React, { useState } from 'react';
import { View, Text, TextInput,StyleSheet, Alert,Image,TouchableOpacity } from 'react-native';
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


<View style={styles.header}>
        <Image source={require('../../assets/Images/Splash1.png')} style={styles.logo} />
        <Text style={styles.title}>EcoAlert</Text>
      </View>

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

      

      <TouchableOpacity onPress={handleSubmit} style={styles.postblogbutton}>
        <Text style={styles.postblogtext}>Post Blog</Text>
      </TouchableOpacity>


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

  header: {
    flexDirection: 'row', // Aligns the logo and text horizontally
    alignItems: 'center',  // Vertically aligns them in the center
    marginBottom: 50,
    top: 80,
    left: 5,
  },
  logo: {
    width: 80, // Adjust width as needed
    height: 100, // Adjust height as needed
    marginRight: 10, // Space between logo and text
    top: -40,
    left: 220,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: -50,
    marginBottom: 25,
  },
  label: {
    fontSize: 18,
    marginTop: 36,
    marginBottom: 1,
    fontWeight: 'bold',
  },
 

  input: {
    width: '100%',
    height: 50,
    borderColor: '#32CD32',
    borderWidth: 1,
    borderRadius: 19,
    paddingHorizontal: 15,
    marginVertical: 10,
    marginBottom: 0,
    fontSize: 16,
 },
 postblogtext: {
  fontSize: 18,
  fontWeight: 'bold',
  textAlign: 'center',
  width: '100%',
},
postblogbutton: {
  width: '70%',
  backgroundColor: '#D1FFBD',
  height: 50,
  borderRadius: 50,
  justifyContent: 'center',
  alignItems: 'center',
  marginVertical: 10,
  top: 20,
  marginTop: 40,
  borderWidth: 1,
  left:55
  
},
});

export default CreateBlog;
