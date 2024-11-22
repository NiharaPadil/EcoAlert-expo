


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../../constants/firebaseConfig';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';

const MainScreen = () => {
  const [sosActive, setSosActive] = useState(false);
  const [sosTimeout, setSosTimeout] = useState<NodeJS.Timeout | null>(null);
  const [userInfo, setUserInfo] = useState({ Name: '', PhoneNum: '' });

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
    Alert.alert("Alert", "This feature will show alerts from forest authorities if any wildlife is spotted outside the reserve.");
  };

  const handleBlogPage = () => {
    router.push('./4_Blogs');
  };

  const handleSosPressIn = () => {
    setSosTimeout(setTimeout(() => {
      setSosActive(true);
      Alert.alert(
        'Emergency Alert',
        'Are you sure it’s an emergency?',
        [
          {
            text: 'Cancel',
            onPress: () => setSosActive(false),
            style: 'cancel'
          },
          { text: 'Yes', onPress: selectSosType }
        ]
      );
    }, 3000));
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
    // <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/Images/Splash1.png')} style={styles.logo} />
        <Text style={styles.title}>EcoAlert</Text>
      </View>
      <TouchableOpacity style={[styles.button, {right:50,marginTop:-50}]} onPress={handleReportIncident}>
  <Image 
    source={require('../../assets/Images/report.png')} // Update with your image path
    style={styles.icon} 
  />
  <Text style={styles.buttonText}>Report Incident</Text>
</TouchableOpacity>




   <TouchableOpacity style={[styles.button,{left:50,width:270}]} onPress={handleBlogPage}>
   <Image 
    source={require('../../assets/Images/blog.png')} // Update with your image path
    style={[styles.icon,{left:10}]} 
  />

        <Text style={styles.buttonText}>Blog Page</Text>
      </TouchableOpacity>




      <TouchableOpacity style={[styles.alertButton,{top:20}]} onPress={handleAlertsInYourArea}>
        <Text style={styles.alertText}>Alerts in Your Area</Text>
      </TouchableOpacity>




      <TouchableOpacity
        style={[styles.sosButton, { top: 30 }]} 
  
      >
        <TouchableOpacity
          onPressIn={handleSosPressIn}
          onPressOut={handleSosPressOut}
          style={styles.touchable}
        >
          <Text style={styles.sosText}>SOS</Text>
          <Text style={[styles.sosText,{marginTop:10,fontSize:20,textAlign:'center'}]}>Press and hold for 3 Seconds</Text>
        </TouchableOpacity>
      </TouchableOpacity>



      <TouchableOpacity onPress={handleSignOut} style={[styles.signOutButton,{top:30}]}>
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
  },
  logo: {
    width: 100, // Adjust width as needed
    height: 120, // Adjust height as needed
    marginRight: 10, // Space between logo and text
    top: -45,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: -50,
    marginBottom: 25,
  },
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
    width: 250,
    height: 250,
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#ffe6e6',
    borderColor: 'red', 
    borderWidth: 2,
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
  },
  signOutText: {
    color: '#32CD32',
    fontSize: 18,
    fontWeight: 'bold',
  },
 
});
