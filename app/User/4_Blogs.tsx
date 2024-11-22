import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { db } from '../../constants/firebaseConfig';
import { collection, onSnapshot, DocumentData } from 'firebase/firestore';
import moment from 'moment';
import { useRouter } from 'expo-router';

interface Blog {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  title: string;
  type: string;
  image: string;
}

const BlogViewer = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Blogs'), (snapshot) => {
      const fetchedBlogs = snapshot.docs.map((doc) => {
        const docData = doc.data() as DocumentData;
        const timestamp = docData.TimeStamp;
        const formattedTimestamp = timestamp
          ? moment(new Date(timestamp.seconds * 1000)).format('MMM D, YYYY h:mm A')
          : 'Unknown Time';

        return {
          id: doc.id,
          author: docData.Author,
          content: docData.Content,
          timestamp: formattedTimestamp,
          title: docData.Title,
          type: docData.Type,
          image: docData.imageurl,
        } as Blog;
      });

      setBlogs(fetchedBlogs);
      setFilteredBlogs(fetchedBlogs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleReadMore = (blog: Blog) => {
    router.push(`./5_BlogDetail?id=${blog.id}`);
  };

  const handleCreateBlog = () => {
    router.push('./6_CreateBlog');
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
  
    if (text === '') {
      setFilteredBlogs(blogs); // Reset to full list if search is cleared
    } else {
      const filtered = blogs.filter((blog) => {
        // Safely check if the properties exist before calling toLowerCase()
        const title = blog.title?.toLowerCase() || '';
        const author = blog.author?.toLowerCase() || '';
        const type = blog.type?.toLowerCase() || '';
  
        return (
          title.includes(text.toLowerCase()) ||
          author.includes(text.toLowerCase()) ||
          type.includes(text.toLowerCase())
        );
      });
      setFilteredBlogs(filtered);
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.header}>
        <Image source={require('../../assets/Images/Splash1.png')} style={styles.logo} />
        <Text style={styles.title1}>EcoAlert</Text>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search by title, author, or type..."
        placeholderTextColor="#A5D6A7"
        value={searchText}
        onChangeText={handleSearch}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#28A745" />
        ) : (
          filteredBlogs.map((blog) => (
            <View key={blog.id} style={styles.card}>
              <Image source={{ uri: blog.image }} style={styles.image} />
              <View style={styles.infoContainer}>
                <Text style={styles.title}>{blog.title}</Text>
                <Text style={styles.author}>By {blog.author}</Text>
                <Text style={styles.timestamp}>{blog.timestamp}</Text>
                <Text numberOfLines={2} style={styles.content}>
                  {blog.content}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleReadMore(blog)} style={styles.readMoreButton}>
                <Text style={styles.readMoreText}>READ MORE</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
      <TouchableOpacity onPress={handleCreateBlog} style={styles.createBlogButton}>
        <Text style={styles.createBlogText}>CREATE A BLOG</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    //alignItems: 'center',

  },
  screenTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#2E7D32', // Dark green
    textAlign: 'center',
    marginVertical: 16,
    bottom: -40,
    marginBottom: 70,
  },
  searchBar: {
    height: 40,
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#388E3C', // Medium green for text
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 16,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 30,
    backgroundColor: 'white',
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 330,
  },
  image: {
    width: '100%',
    height: 150,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32', // Dark green for the title
    marginBottom: 8,
  },
  author: {
    fontSize: 14,
    color: '#388E3C', // Medium green for the author
  },
  timestamp: {
    fontSize: 12,
    color: '#7CB342', // Light green for the timestamp
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#4CAF50', // Balanced green for the content
  },
  readMoreButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#43A047', // Vibrant green button
    alignItems: 'center',
  },
  readMoreText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  createBlogButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 15,
    backgroundColor: '#2E7D32', // Dark green button
    borderRadius: 8,
    alignItems: 'center',
  },
  createBlogText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row', // Aligns the logo and text horizontally
    alignItems: 'center',  // Vertically aligns them in the center
    marginBottom: 60,
  },
  logo: {
    width: 90, // Adjust width as needed
    height: 90, // Adjust height as needed
    marginRight: 110, // Space between logo and text
    position: 'absolute', // Ensure it's positioned relative to its container
    top: 20, // Adjust as needed for alignment
    right: 10, // Adjust to place it appropriately inside the container
  },
  
  title1: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 50, // Space above the title
    alignSelf: 'center', 
    right: -130, // Adjust to place it appropriately inside the container
    
  },

});

export default BlogViewer;
