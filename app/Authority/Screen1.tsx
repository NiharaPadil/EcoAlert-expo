import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  TextInput,
} from 'react-native';
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  DocumentData,
} from 'firebase/firestore';
import moment from 'moment';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../constants/firebaseConfig';
import { signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

interface SOSAlert {
  id: string;
  name: string;
  phonenumber: string;
  status: string;
  timestamp: string;
  type: string;
  latitude: number;
  longitude: number;
}

export default function HomePage() {
  const router = useRouter();
  const db = getFirestore();
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    if (message.trim() === '') {
      alert('Message cannot be empty!');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'Broadcast'), {
        message,
        timestamp: new Date().toISOString(),
      });
      console.log('Message sent with ID:', docRef.id);
      alert('Message Broadcasted Successfully!');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send the message.');
    }
  };

  const handleViewDetails = (alert: SOSAlert) => {
    router.push(`./2_SOSDetail?id=${alert.id}`);
  };

  const handleBlogPage = () => {
    router.push('./4_Blogsauth');
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('isLoggedIn');
      router.replace('../Authentication/SignInMainPage');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'SOS'), (snapshot) => {
      const fetchedAlerts = snapshot.docs.map((doc) => {
        const docData = doc.data() as DocumentData;
        const timestamp = docData.timestamp;
        const formattedTimestamp = timestamp
          ? moment(new Date(timestamp.seconds * 1000)).format(
              'MMM D, YYYY h:mm A'
            )
          : 'Unknown Time';
        return {
          id: doc.id,
          name: docData.Name,
          phonenumber: docData.phonenumber,
          status: docData.status,
          timestamp: formattedTimestamp,
          type: docData.type,
          latitude: docData.location?.latitude || 0,
          longitude: docData.location?.longitude || 0,
        } as SOSAlert;
      });

      setSosAlerts(fetchedAlerts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/Images/Splash1.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>EcoAlert</Text>
      </View>

      <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.messageContainer}>
        <TextInput
          style={styles.input}
          placeholder="Broadcast message..."
          placeholderTextColor="#ccc"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* SOS Alerts Section */}
      <Text style={styles.sectionTitle}>SOS Alerts</Text>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            sosAlerts.map((alert) => (
              <TouchableOpacity
                key={alert.id}
                style={styles.card}
                onPress={() => handleViewDetails(alert)}
              >
                <Text style={styles.cardTitle}>{alert.name}</Text>
                <Text style={styles.cardContent}>
                  Phone: {alert.phonenumber}
                </Text>
                <Text style={styles.cardContent}>
                  Type: {alert.type}, Status: {alert.status}
                </Text>
                <Text style={styles.cardContent}>
                  Timestamp: {alert.timestamp}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>


      {/* Reports Section */}
      <Text style={styles.sectionTitle}>Reports </Text>
            <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            sosAlerts.map((alert) => (
              <TouchableOpacity
                key={alert.id}
                style={styles.card}
                onPress={() => handleViewDetails(alert)}
              >
                <Text style={styles.cardTitle}>{alert.name}</Text>
                <Text style={styles.cardContent}>
                  Phone: {alert.phonenumber}
                </Text>
                <Text style={styles.cardContent}>
                  Type: {alert.type}, Status: {alert.status}
                </Text>
                <Text style={styles.cardContent}>
                  Timestamp: {alert.timestamp}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>


      <TouchableOpacity style={[styles.button,{left:50,width:270}]} onPress={handleBlogPage}>
   <Image 
    source={require('../../assets/Images/blog.png')} // Update with your image path
    style={[styles.icon,{left:10}]} 
  />

        <Text style={styles.buttonText}>Blog Page</Text>
      </TouchableOpacity>





    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 80,
    height: 70,
    marginRight: 10,
    top: 25,
    right: -160,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 80,
    marginBottom: 25,
    right: 50,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 18,
    borderBottomEndRadius: 18,
    backgroundColor: '#FFFFFF', // White background
    borderColor: '#4CAF50',     // Green border color
    borderWidth: 2,  
    bottom: -40,
    left: 330,
    width: 90,
    height: 40,
    top: -10,
  },
  logoutText: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  broadcastButton: {
    margin: 16,
    padding: 12,
    backgroundColor: '#03dac5',
    borderRadius: 8,
    alignItems: 'center',
  },
  broadcastText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    marginBottom: 56,
    paddingHorizontal: 6,
    paddingVertical: -10,
    
    
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 20,
    borderColor: 'green', 
    borderWidth: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: -15,
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: '#cefad0',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardContent: {
    fontSize: 14,
    color: '#333',
  },
  input: {
    flex: 1,
    color: 'black',
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  sendButton: {
    backgroundColor: 'white', // Replace with desired button color
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBlockEndColor: 'black',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff', // Background color for the container
    paddingHorizontal: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 16,
    marginBottom: 36,
    marginTop: 36,
  },
  button: {
    height: 60,
  right: 450,
    padding: 15,
    borderRadius: 90,
    backgroundColor: '#FFFFFF', // White background
    borderColor: '#4CAF50',     // Green border color
    borderWidth: 2,             // Border thickness
    alignItems: 'center',
    marginVertical: 0,
    marginHorizontal: 35,
    marginTop: -30,
    flexDirection: 'row', 
    justifyContent: 'center',
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 14,
    color: '#009933',
    textAlign: 'center',
    fontWeight: '600',
  },
  icon: {
    width: 25, // Adjust width as needed
    height: 25, // Adjust height as needed
    marginRight: 10, // Space between icon and text
  },
});
