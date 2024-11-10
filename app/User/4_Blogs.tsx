// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Image, Pressable, ActivityIndicator, TouchableOpacity,Button } from 'react-native';
// import { db } from '../../constants/firebaseConfig';
// import { collection, onSnapshot, DocumentData } from 'firebase/firestore';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import moment from 'moment';
// import { useNavigation } from '@react-navigation/native';
// import { useRouter } from 'expo-router';

// import BlogDetail from './5_BlogDetail'
// interface Blog {
//   id: string;
//   author: string;
//   content: string;
//   timestamp: string;
//   title: string;
//   type: string;
//   image: string;
// }

// const BlogViewer = () => {
//   const router= useRouter();
//   const [blogs, setBlogs] = useState<Blog[]>([]);
//   const [loading, setLoading] = useState(true);
//   const navigation = useNavigation(); // Use navigation hook

//   useEffect(() => {
//     const unsubscribe = onSnapshot(collection(db, 'Blogs'), (snapshot) => {
//       const fetchedBlogs = snapshot.docs.map((doc) => {
//         const docData = doc.data() as DocumentData;
//         const timestamp = docData.TimeStamp; // Adjust if the field name is different
//         const formattedTimestamp = timestamp 
//           ? moment(new Date(timestamp.seconds * 1000)).format('MMM D, YYYY h:mm A') 
//           : 'Unknown Time';
        
//         return {
//           id: doc.id,
//           author: docData.Author,
//           content: docData.Content,
//           timestamp: formattedTimestamp,
//           title: docData.Title,
//           type: docData.Type,
//           image: docData.imageurl,
//         } as Blog;
//       });
      
//       setBlogs(fetchedBlogs);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleReadMore = (blog: Blog) => {
//     router.push(`./5_BlogDetail?id=${blog.id}`) // Navigate to BlogDetail and pass the blog data
//   };

//   const handleCreateBlog = () => {
//     router.push('./6_CreateBlog'); // Navigate to the CreateBlog page
//   };

//   return (
    
//     <KeyboardAwareScrollView contentContainerStyle={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : (
//         blogs.map((blog) => (
//           <View key={blog.id} style={styles.card}>
//             <Image source={{ uri: blog.image }} style={styles.image} />
//             <Text style={styles.title}>{blog.title}</Text>
//             <Text style={styles.author}>By {blog.author}</Text>
//             <Text style={styles.timestamp}>{blog.timestamp}</Text>
//             <Text numberOfLines={2} style={styles.content}>{blog.content}</Text>
//             <TouchableOpacity onPress={() => handleReadMore(blog)} style={styles.readMoreButton}>
//               <Text style={styles.readMoreText}>READ MORE</Text>
//             </TouchableOpacity>
            
//           </View>
//         ))
//       )}
//        <TouchableOpacity onPress={handleCreateBlog} style={styles.createBlogButton}>
//         <Text style={styles.createBlogText}>CREATE A BLOG</Text>
//       </TouchableOpacity>
//     </KeyboardAwareScrollView>
    
  
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: 'white',
//     height: '100%',
//   },
//   card: {
//     marginBottom: 16,
//     padding: 16,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     elevation: 2,
//   },
//   image: {
//     width: '100%',
//     height: 150,
//     borderRadius: 8,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 8,
//   },
//   author: {
//     fontSize: 14,
//     color: 'black',
//   },
//   timestamp: {
//     fontSize: 12,
//     color: '#999',
//     marginBottom: 8,
//   },
//   content: {
//     fontSize: 14,
//     color: '#333',
//   },
//   readMoreButton: {
//     marginTop: 10,
//     padding: 10,
//     backgroundColor: '#007AFF',
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   readMoreText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   createBlogButton: {
//     marginTop: 20,
//     padding: 15,
//     backgroundColor: '#28A745',
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   createBlogText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default BlogViewer;


import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          blogs.map((blog) => (
            <View key={blog.id} style={styles.card}>
              <Image source={{ uri: blog.image }} style={styles.image} />
              <Text style={styles.title}>{blog.title}</Text>
              <Text style={styles.author}>By {blog.author}</Text>
              <Text style={styles.timestamp}>{blog.timestamp}</Text>
              <Text numberOfLines={2} style={styles.content}>{blog.content}</Text>
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
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100, // Add padding to ensure content is above the button
  },
  card: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  author: {
    fontSize: 14,
    color: 'black',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#333',
  },
  readMoreButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  readMoreText: {
    color: 'white',
    fontWeight: 'bold',
  },
  createBlogButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 15,
    backgroundColor: '#28A745',
    borderRadius: 5,
    alignItems: 'center',
  },
  createBlogText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BlogViewer;
