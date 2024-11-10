// import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
// import React, { useState } from 'react';
// import { router } from 'expo-router';
// import { signOut } from 'firebase/auth';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { auth } from '../../constants/firebaseConfig';

// const Screen1 = () => {
//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       await AsyncStorage.removeItem('isLoggedIn');
//       router.replace('../Authentication/SignInMainPage'); // Adjust the path to your login page
//     } catch (error) {
//       console.error('Error signing out: ', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text>Screen1</Text>
//       <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
//         <Text style={styles.signOutText}>Sign Out</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default Screen1;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'white',
//   },
//   signOutButton: {
//     width: 150,
//     height: 50,
//     backgroundColor: '#32CD32', // Green color for the button
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   signOutText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });


import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { db } from '../../constants/firebaseConfig'; // Adjust the import path as necessary
import { collection, onSnapshot, DocumentData } from 'firebase/firestore';
import moment from 'moment';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../constants/firebaseConfig';


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

const SOSAlerts = () => {

  const handleSignOut = async () => {
        try {
          await signOut(auth);
          await AsyncStorage.removeItem('isLoggedIn');
          router.replace('../Authentication/SignInMainPage'); // Adjust the path to your login page
        } catch (error) {
          console.error('Error signing out: ', error);
        }
      };

  const router = useRouter();
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'SOS'), (snapshot) => {
      const fetchedAlerts = snapshot.docs.map((doc) => {
        const docData = doc.data() as DocumentData;
        const timestamp = docData.timestamp; 
        const formattedTimestamp = timestamp
          ? moment(new Date(timestamp.seconds * 1000)).format('MMM D, YYYY h:mm A')
          : 'Unknown Time';
       console.log(docData.Name)
        return {
          id: doc.id,
          name: docData.Name,
          phonenumber: docData.phonenumber,
          status: docData.status,
          timestamp: formattedTimestamp,
          type: docData.type,
          latitude: docData.location.latitude,
          longitude: docData.location.longitude,
        } as SOSAlert;
      });

      setSosAlerts(fetchedAlerts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleViewDetails = (alert: SOSAlert) => {
    router.push(`./2_SOSDetail?id=${alert.id}`); // Adjust the route as needed
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          sosAlerts.map((alert) => (
            <View key={alert.id} style={styles.card}>
              <Text style={styles.title}>SOS Alert from {alert.name}</Text>
              <Text style={styles.timestamp}>{alert.timestamp}</Text>
              <Text style={styles.status}>Status: {alert.status}</Text>
              <Text style={styles.content}>Type: {alert.type}</Text>
              <Text style={styles.content}>Phone: {alert.phonenumber}</Text>
              <Text style={styles.content}>Location: {alert.latitude}, {alert.longitude}</Text>
              <TouchableOpacity onPress={() => handleViewDetails(alert)} style={styles.viewDetailsButton}>
                <Text style={styles.viewDetailsText}>VIEW DETAILS</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
      <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
         <Text style={styles.signOutText}>Sign Out</Text>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    color: '#333',
  },
  content: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  viewDetailsButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  viewDetailsText: {
    color: 'white',
    fontWeight: 'bold',
  },
  signOutButton: {
        width: 150,
        height: 50,
        backgroundColor: '#32CD32', // Green color for the button
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
      },
      signOutText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
      },
});

export default SOSAlerts;
