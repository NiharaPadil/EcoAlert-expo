


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../../constants/firebaseConfig';
import { addDoc, collection, doc, getDoc, getFirestore, onSnapshot, DocumentData } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { Vibration } from 'react-native';


const MainScreen = () => {
  const [sosActive, setSosActive] = useState(false);
  const [sosTimeout, setSosTimeout] = useState<NodeJS.Timeout | null>(null);
  const [userInfo, setUserInfo] = useState({ Name: '', PhoneNum: '' });
  const db = getFirestore();
  interface BroadcastMessage {
    id: string;
    message: any;
    timestamp: any;
  }
  
  const [broadcastMessage, setBroadcastMessage] = useState<BroadcastMessage[]>([]);

useEffect(() => {
  // Real-time listener for Broadcast messages
  const unsubscribe = onSnapshot(collection(db, 'Broadcast'), (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      message: doc.data().message,
      timestamp: doc.data().timestamp,
    }));
    setBroadcastMessage(messages);
  });

  return () => unsubscribe(); // Clean up listener on unmount
}, []);


  useEffect(() => {
    // Fetch user information from Firestore based on current user's uid
    const fetchUserInfo = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'UserData', user.uid));
      
          if (userDoc.exists()) {
            setUserInfo(userDoc.data() as { Name: string; PhoneNum: string }); // Set user info state with document data
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user info: ', error);
        }
      }
    };

    fetchUserInfo();
  }, []);


  

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('isLoggedIn');
      router.replace('../Authentication/SignInMainPage');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleReportIncident = () => {
    router.push('./2_ReportIncident');
  };

  const handleAlertsInYourArea = () => {
    router.push('./3_AlertsInArea');
    // Alert.alert("Alert", "This feature will show alerts from forest authorities if any wildlife is spotted outside the reserve.");
  };

  const handleBlogPage = () => {
    router.push('./4_Blogs');
  };


const handleSosPressIn = () => {
  setSosTimeout(
    setTimeout(() => {
      // Vibrate the device
      Vibration.vibrate(1000); // Vibrates for 1 second

      setSosActive(true);
      Alert.alert(
        'Emergency Alert',
        'Are you sure it’s an emergency?',
        [
          {
            text: 'Cancel',
            onPress: () => setSosActive(false),
            style: 'cancel',
          },
          { text: 'Yes', onPress: selectSosType },
        ]
      );
    }, 3000)
  );
};

  const handleSosPressOut = () => {
    if (sosTimeout) {
      clearTimeout(sosTimeout);
    }
    setSosActive(false);
  };

  const selectSosType = () => {
    Alert.alert(
      'SOS Type',
      'Please select the type of emergency:',
      [
        {
          text: 'Tree Cutting',
          onPress: () => sendSosAlert('Tree Cutting')
        },
        {
          text: 'Animal Poaching',
          onPress: () => sendSosAlert('Animal Poaching')
        },
      ]
    );
  };

  const sendSosAlert = async (type: string) => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permissions are required for SOS alert.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const user = auth.currentUser;
      
      if (user) {
        await addDoc(collection(db, 'SOS'), {
          name: userInfo.Name || 'Unknown User',
          phonenumber: userInfo.PhoneNum || 'Not provided',
          status: 'none',
          timestamp: new Date(),
          type,
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          userid: user.uid,
        });

        Alert.alert(
          'SOS Sent',
          'SOS HAS BEEN SENT TO NEARBY AUTHORITIES. THEY WILL ARRIVE SOON.'
        );
      }
    } catch (error) {
      console.error('Error sending SOS alert: ', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/Images/Splash1.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>EcoAlert</Text>
      </View>

      <Text style={styles.broadcastTitle}>Broadcast Notifications</Text>
<ScrollView style={styles.scrollContainer}>
  {broadcastMessage && Array.isArray(broadcastMessage) && broadcastMessage.length > 0 ? (
    broadcastMessage.map((message: any) => (
      <View key={message.id} style={styles.notificationCard}>
        <Text style={styles.messageText}>{message.message}</Text>
      </View>
    ))
  ) : (
    <Text>No notifications available</Text>
  )}
</ScrollView>


      <TouchableOpacity
        style={[styles.button, { right: 50, marginTop: -50 }]}
        onPress={handleReportIncident}
      >
        <Image
          source={require('../../assets/Images/report.png')}
          style={styles.icon}
        />
        <Text style={styles.buttonText}>Report Incident</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { left: 50, width: 270 }]}
        onPress={handleBlogPage}
      >
        <Image
          source={require('../../assets/Images/blog.png')}
          style={[styles.icon, { left: 10 }]}
        />
        <Text style={styles.buttonText}>Blog Page</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.alertButton, { top: 20 }]}
        onPress={handleAlertsInYourArea}
      >
        <Text style={styles.alertText}>Alerts in Your Area</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.sosButton, { top: 10 }]}>
        <TouchableOpacity
          onPressIn={handleSosPressIn}
          onPressOut={handleSosPressOut}
          style={styles.touchable}
        >
          <Text style={styles.sosText}>SOS</Text>
          <Text style={[styles.sosText, styles.sosInstruction]}>
            Press and hold for 3 Seconds
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSignOut}
        style={[styles.signOutButton, { top: 30 }]}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row', // Aligns the logo and text horizontally
    alignItems: 'center',  // Vertically aligns them in the center
    marginBottom: 20,
    marginTop: 130,
  },
  logo: {
    width: 100, // Adjust width as needed
    height: 100, // Adjust height as needed
    marginRight: 10, // Space between logo and text
    top: -45,
    
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: -50,
    marginBottom: 25,
  }
  ,
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    height: 100,
    padding: 15,
    borderRadius: 90,
    backgroundColor: '#FFFFFF', // White background
    borderColor: '#4CAF50',     // Green border color
    borderWidth: 2,             // Border thickness
    alignItems: 'center',
    marginVertical: 10,
    flexDirection: 'row', 
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 24,
    color: '#009933',
    textAlign: 'center',
    fontWeight: '600',
  },
  icon: {
    width: 55, // Adjust width as needed
    height: 55, // Adjust height as needed
    marginRight: 10, // Space between icon and text
  },
  alertButton: {
    width: 350,
    height: 100,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderColor: '#FFA500', 
    borderWidth: 2,
    alignItems: 'center',
    marginVertical: 10,
  },
  alertText: {
    fontSize: 30,
    color: '#FFA500',
    marginTop: 10,
    fontWeight: '600',
  },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#ffe6e6',
    borderColor: 'red', 
    borderWidth: 2,
    padding: 10,
    textAlign: 'center',
    marginBottom:-25
  },
  sosText: {
    fontSize: 30,
    color: 'red',
    fontWeight: '600'
  },
  touchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutButton: {
    width: 150,
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#32CD32',
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 60,
  },
  signOutText: {
    color: '#32CD32',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  notificationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    width: 350,
     // Allows the card to expand as content inside grows
    maxHeight: 400, // Set a max height for the box
    overflow: 'hidden', // Ensures nothing overflows the container's edges
  },
  
  
  messageText: {
    fontSize: 18,  // Increase font size for better readability
    color: 'black',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  
 
  noMessagesText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
  },
  noMessagesContainer: {
    height: '100%', // Smaller height
    width: '100%', // Consistent width
    backgroundColor: '#f9f9f9', // Subtle background color
    borderRadius: 8,
    elevation: 1, // Reduced shadow for a minimal look
    shadowColor: '#000',
    shadowOpacity: 0.05, // Lighter shadow
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    justifyContent: 'center',
    alignItems: 'center',
    padding: -45, // Reduced padding for a cleaner appearance
  

  },scrollContainer: {
    maxHeight: 400, // Limits height of the scrollable area
    width: '80%',
    //height: '50%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowOffset: { width: 10, height: 20 },
    padding: 10,
    marginBottom: 80,
    marginTop:10
  },
  sosInstruction: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  broadcastTitle: {

    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 0,
    marginTop: -50,
  },
 
});




