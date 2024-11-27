// app/BlogDetail.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter,useLocalSearchParams } from 'expo-router'; // Use useSearchParams
import { db } from '../../constants/firebaseConfig'; // Ensure your db is correctly imported
import { doc, getDoc } from 'firebase/firestore';
import moment from 'moment'; // Make sure to import moment if you use it

interface Blog {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  title: string;
  type: string;
  image: string;
}

const BlogDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Use useSearchParams to get query parameters
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return; // Ensure id is present before fetching
      const docRef = doc(db, 'Blogs', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const docData = docSnap.data();
        const formattedTimestamp = docData.TimeStamp
          ? moment(new Date(docData.TimeStamp.seconds * 1000)).format('MMM D, YYYY h:mm A')
          : 'Unknown Time';

        setBlog({
          id: docSnap.id,
          author: docData.Author,
          content: docData.Content,
          timestamp: formattedTimestamp,
          title: docData.Title,
          type: docData.Type,
          image: docData.imageurl,
        });
      } else {
        console.log('No such document!');
      }
      setLoading(false); // Set loading to false after fetching
    };

    fetchBlog();
  }, [id]);

  // Loading state handling
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!blog) {
    return (
      <View style={styles.container}>
        <Text>No blog found!</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
      <Image source={{ uri: blog.image }} style={styles.image} />
      <Text style={styles.title}>{blog.title}</Text>
      <Text style={styles.author}>By {blog.author}</Text>
      <Text style={styles.timestamp}>{blog.timestamp}</Text>
      <Text style={styles.content}>{blog.content}</Text>
      <TouchableOpacity onPress={() => router.back()} style={styles.goback}>
        <Text style={styles.title}>Go Back</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
};

// Define your styles
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    height: '100%',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  author: {
    fontSize: 16,
    color: 'black',
  },
  timestamp: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    color: '#333',
  },
  card:{
    marginTop:100
  },
  goback: {
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
    left:55,
    bottom:10
    
  },
});

export default BlogDetail;
