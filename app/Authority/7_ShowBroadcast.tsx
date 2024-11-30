import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import { db } from '../../constants/firebaseConfig'; // Adjust the path to your firebaseConfig
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import moment from 'moment';

interface BroadcastMessage {
  id: string;
  message: string;
  timestamp: string;
}

const ShowBroadcast = () => {
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch messages from Firestore
  const fetchBroadcasts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'Broadcast'));
      const messages: BroadcastMessage[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        message: doc.data().message,
        timestamp: doc.data().timestamp
          ? moment(new Date(doc.data().timestamp.seconds * 1000)).format('MMM D, YYYY h:mm A')
          : 'Unknown Time',
      }));
      setBroadcasts(messages);
    } catch (error) {
      console.error('Error fetching broadcasts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle message deletion
  const handleDelete = async (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'Broadcast', id));
              Alert.alert('Message deleted!');
              fetchBroadcasts(); // Refresh the list
            } catch (error) {
              console.error('Error deleting message:', error);
              Alert.alert('Failed to delete message.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  // Show loading spinner
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
        <View style={styles.box}>
      <Text style={styles.header}>Broadcast Messages</Text>
      <FlatList
        data={broadcasts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>

          </View>
        )}
        ListEmptyComponent={<Text style={styles.noMessages}>No messages to display.</Text>}
      />

</View>
    </View>
  );
};

export default ShowBroadcast;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  box:{
    marginTop:60
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  message: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 4,
    alignSelf: 'flex-end',

  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noMessages: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
