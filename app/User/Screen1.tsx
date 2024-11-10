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


// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Alert, Pressable } from 'react-native';
// import { router } from 'expo-router';
// import * as Location from 'expo-location';
// import { signOut } from 'firebase/auth';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { auth } from '../../constants/firebaseConfig';
// import { LinearGradient } from 'expo-linear-gradient';

// const MainScreen = () => {
//   const [sosActive, setSosActive] = useState(false);
//   const [sosTimeout, setSosTimeout] = useState<NodeJS.Timeout | null>(null);

//   const handleSignOut = async () => {
//         try {
//           await signOut(auth);
//           await AsyncStorage.removeItem('isLoggedIn');
//           router.replace('../Authentication/SignInMainPage'); // Adjust the path to your login page
//         } catch (error) {
//           console.error('Error signing out: ', error);
//         }
//       };

//   const handleReportIncident = () => {
//     router.push('./2_ReportIncident'); // Replace with your actual route
//   };

//   const handleAlertsInYourArea = () => {
//     router.push('./3_AlertsInArea'); // Replace with your actual route
//     Alert.alert("Alert", "This feature will show alerts from forest authorities if any wildlife is spotted outside the reserve.");
//     // Implement notifications or alerts as per your app logic
//   };

//   const handleBlogPage = () => {
//     router.push('./4_Blogs'); // Replace with your actual route
//   };

//   const handleSosPressIn = () => {
//     setSosTimeout(setTimeout(() => {
//       setSosActive(true);
//       Alert.alert(
//         'Emergency Alert',
//         'Are you sure it’s an emergency?',
//         [
//           {
//             text: 'Cancel',
//             onPress: () => setSosActive(false),
//             style: 'cancel'
//           },
//           { text: 'Yes', onPress: sendSosAlert }
//         ]
//       );
//     }, 3000)); // 5-second hold
//   };

//   const handleSosPressOut = () => {
//     if (sosTimeout) {
//       clearTimeout(sosTimeout);
//     }
//     setSosActive(false);
//   };

//   const sendSosAlert = async () => {
//     try {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Denied', 'Location permissions are required for SOS alert.');
//         return;
//       }
//       let location = await Location.getCurrentPositionAsync({});
//       // Here you would send the location to authorities
//       Alert.alert('SOS Alert Sent', `Location: ${location.coords.latitude}, ${location.coords.longitude}`);
//       // Implement logic to send location to the forest authority and police stations
//     } catch (error) {
//       console.error('Error sending SOS alert: ', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>EcoAlert</Text>

//       <TouchableOpacity style={styles.button} onPress={handleReportIncident}>
//         <Text style={styles.buttonText}>Report Incident</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.alertButton} onPress={handleAlertsInYourArea}>
//         <Text style={styles.alertText}>Alerts in Your Area</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.button} onPress={handleBlogPage}>
//         <Text style={styles.buttonText}>Blog Page</Text>
//       </TouchableOpacity>

//       {/* <Pressable
//         onPressIn={handleSosPressIn}
//         onPressOut={handleSosPressOut}
//         style={styles.sosButton}
//       >
//         <Text style={styles.sosText}>SOS</Text>
//       </Pressable> */}

// <LinearGradient
//       colors={['#FF6347', '#FF4500']} // Red gradient colors
//       style={styles.sosButton}
//     >
//       <TouchableOpacity onPressIn={handleSosPressIn}
//         onPressOut={handleSosPressOut} style={styles.touchable}>
//         <Text style={styles.sosText}>SOS</Text>
//       </TouchableOpacity>
//     </LinearGradient>
    

//       <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
//          <Text style={styles.signOutText}>Sign Out</Text>
//        </TouchableOpacity>

//     </View>
//   );
// };

// export default MainScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//    marginTop:-50,
//    marginBottom: 25,
//   },
//   button: {
//     width: 350,
//     height: 100,
//     padding: 15,
//     borderRadius: 10,
//     backgroundColor: '#4CAF50',
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   buttonText: {
//     fontSize: 30,
//     alignContent: 'center',
//     color: 'white',
//     textAlign: 'center',
//     marginTop: 10,
//     fontWeight: '600',
//   },
//   alertButton: {
//     width: 350,
//     height:100,
//     padding: 15,
//     borderRadius: 10,
//     backgroundColor: '#FFA500',
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   alertText: {
//     fontSize: 30,
//     color: 'white',
//     marginTop: 10,
//     fontWeight: '600',
//   },
//   // sosButton: {
//   //   width: 250,
//   //   padding: 15,
//   //   borderRadius: 10,
//   //   backgroundColor: '#FF6347',
//   //   alignItems: 'center',
//   //   marginVertical: 20,
//   // },
//   // sosText: {
//   //   fontSize: 18,
//   //   color: 'white',
//   //   fontWeight: '600',
//   // },

//   sosButton: {
//     width: 250,
//     height: 250, // Make the button height equal to its width for a round shape
//     borderRadius: 125, // Half of the width and height for a perfect circle
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   sosText: {
//     fontSize: 30, // Increased font size for better visibility
//     color: 'white',
//     fontWeight: '600',
//   },
//   touchable: {
//     width: '100%', // Ensures the TouchableOpacity fills the LinearGradient
//     height: '100%', // Ensures the TouchableOpacity fills the LinearGradient
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//     signOutButton: {
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


// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Alert, Pressable } from 'react-native';
// import { router } from 'expo-router';
// import * as Location from 'expo-location';
// import { signOut } from 'firebase/auth';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { auth, db } from '../../constants/firebaseConfig';
// import { addDoc, collection } from 'firebase/firestore';
// import { LinearGradient } from 'expo-linear-gradient';

// const MainScreen = () => {
//   const [sosActive, setSosActive] = useState(false);
//   const [sosTimeout, setSosTimeout] = useState<NodeJS.Timeout | null>(null);

  
//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       await AsyncStorage.removeItem('isLoggedIn');
//       router.replace('../Authentication/SignInMainPage');
//     } catch (error) {
//       console.error('Error signing out: ', error);
//     }
//   };

//   const handleReportIncident = () => {
//     router.push('./2_ReportIncident');
//   };

//   const handleAlertsInYourArea = () => {
//     router.push('./3_AlertsInArea');
//     Alert.alert("Alert", "This feature will show alerts from forest authorities if any wildlife is spotted outside the reserve.");
//   };

//   const handleBlogPage = () => {
//     router.push('./4_Blogs');
//   };

//   const handleSosPressIn = () => {
//     setSosTimeout(setTimeout(() => {
//       setSosActive(true);
//       Alert.alert(
//         'Emergency Alert',
//         'Are you sure it’s an emergency?',
//         [
//           {
//             text: 'Cancel',
//             onPress: () => setSosActive(false),
//             style: 'cancel'
//           },
//           { text: 'Yes', onPress: selectSosType }
//         ]
//       );
//     }, 3000));
//   };

//   const handleSosPressOut = () => {
//     if (sosTimeout) {
//       clearTimeout(sosTimeout);
//     }
//     setSosActive(false);
//   };

//   const selectSosType = () => {
//     Alert.alert(
//       'SOS Type',
//       'Please select the type of emergency:',
//       [
//         {
//           text: 'Tree Cutting',
//           onPress: () => sendSosAlert('Tree Cutting')
//         },
//         {
//           text: 'Animal Poaching',
//           onPress: () => sendSosAlert('Animal Poaching')
//         },
//       ]
//     );
//   };

//   const sendSosAlert = async (type: string) => {
//     try {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Denied', 'Location permissions are required for SOS alert.');
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       const user = auth.currentUser;
      
//       console.log(user)
      
//       if (user) {
//         await addDoc(collection(db, 'SOS'), {
//           name: user.displayName || 'Unknown User',
//           phonenumber: user.phoneNumber || 'Not provided',
//           status: 'none',
//           timestamp: new Date(),
//           type,
//           location: {
//             latitude: location.coords.latitude,
//             longitude: location.coords.longitude,
//           },
//           userid: user.uid,
//         });

//         Alert.alert(
//           'SOS Sent',
//           'SOS HAS BEEN SENT TO NEARBY AUTHORITIES. THEY WILL ARRIVE SOON.'
//         );
//       }
//     } catch (error) {
//       console.error('Error sending SOS alert: ', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>EcoAlert</Text>

//       <TouchableOpacity style={styles.button} onPress={handleReportIncident}>
//         <Text style={styles.buttonText}>Report Incident</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.alertButton} onPress={handleAlertsInYourArea}>
//         <Text style={styles.alertText}>Alerts in Your Area</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.button} onPress={handleBlogPage}>
//         <Text style={styles.buttonText}>Blog Page</Text>
//       </TouchableOpacity>

//       <LinearGradient
//         colors={['#FF6347', '#FF4500']}
//         style={styles.sosButton}
//       >
//         <TouchableOpacity onPressIn={handleSosPressIn}
//           onPressOut={handleSosPressOut} style={styles.touchable}>
//           <Text style={styles.sosText}>SOS</Text>
//         </TouchableOpacity>
//       </LinearGradient>

//       <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
//         <Text style={styles.signOutText}>Sign Out</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default MainScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     marginTop: -50,
//     marginBottom: 25,
//   },
//   button: {
//     width: 350,
//     height: 100,
//     padding: 15,
//     borderRadius: 10,
//     backgroundColor: '#4CAF50',
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   buttonText: {
//     fontSize: 30,
//     color: 'white',
//     textAlign: 'center',
//     marginTop: 10,
//     fontWeight: '600',
//   },
//   alertButton: {
//     width: 350,
//     height: 100,
//     padding: 15,
//     borderRadius: 10,
//     backgroundColor: '#FFA500',
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   alertText: {
//     fontSize: 30,
//     color: 'white',
//     marginTop: 10,
//     fontWeight: '600',
//   },
//   sosButton: {
//     width: 250,
//     height: 250,
//     borderRadius: 125,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   sosText: {
//     fontSize: 30,
//     color: 'white',
//     fontWeight: '600',
//   },
//   touchable: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   signOutButton: {
//     width: 150,
//     height: 50,
//     backgroundColor: '#32CD32',
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


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.title}>EcoAlert</Text>

      <TouchableOpacity style={styles.button} onPress={handleReportIncident}>
        <Text style={styles.buttonText}>Report Incident</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.alertButton} onPress={handleAlertsInYourArea}>
        <Text style={styles.alertText}>Alerts in Your Area</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleBlogPage}>
        <Text style={styles.buttonText}>Blog Page</Text>
      </TouchableOpacity>

      <LinearGradient
        colors={['#FF6347', '#FF4500']}
        style={styles.sosButton}
      >
        <TouchableOpacity onPressIn={handleSosPressIn}
          onPressOut={handleSosPressOut} style={styles.touchable}>
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
      </LinearGradient>

      <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
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
    width: 350,
    height: 100,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '600',
  },
  alertButton: {
    width: 350,
    height: 100,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FFA500',
    alignItems: 'center',
    marginVertical: 10,
  },
  alertText: {
    fontSize: 30,
    color: 'white',
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
  },
  sosText: {
    fontSize: 30,
    color: 'white',
    fontWeight: '600',
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
    backgroundColor: '#32CD32',
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
