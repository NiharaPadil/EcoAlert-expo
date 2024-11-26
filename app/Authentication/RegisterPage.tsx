// import React from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
// import { useRouter } from 'expo-router'; // Import the useRouter hook

// const { width, height } = Dimensions.get('window');

// const RegisterPage = () => {
//   const router = useRouter(); // Create a router instance

//   const user = () => {
//     router.push('/Authentication/UserSignUp'); // Navigate to the User Sign Up page
//   };
  
//   const authorities = () => {
//     router.push('/Authentication/AuthoritiesSignUp'); // Navigate to the Authorities Sign Up page
//   };

//   const SignInMainPage = () => {
//     router.push('/Authentication/SignInMainPage'); // Navigate to the Sign In Main page
//   };

//   return (
//     <View style={styles.container}>
//       {/* Top Image */}
//       <Image source={require('../../assets/Images/Pic1.png')} style={styles.topImage} />

//       {/* App Name */}
//       <Text style={styles.appTitle}>EcoAlert</Text>

//       {/* Register Area with Image */}
//       <TouchableOpacity style={[styles.registerContainer, { marginBottom: -20 }]} onPress={user}>
//         <Image
//           source={require('../../assets/Images/user.png')} // Update with your image path
//           style={styles.registerImage}
//         />
//         <Text style={styles.registerButtonText}>Register as a User</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.registerContainer} onPress={authorities}>
//         <Image
//           source={require('../../assets/Images/autho.png')} // Update with your image path
//           style={styles.registerImage}
//         />
//         <Text style={styles.registerButtonText}>Register as an Authority</Text>
//       </TouchableOpacity>

//       {/* Already have an account? Sign in */}
//       <View style={styles.footer}>
//         <Text style={styles.footerText}>Already have an account?</Text>
//         <TouchableOpacity onPress={SignInMainPage}>
//           <Text style={styles.signInLink}>Sign in</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: height * 0.05,
//   },
//   topImage: {
//     width: width * 0.8, // 80% of screen width
//     height: height * 0.3, // Adjusted height
//     resizeMode: 'contain',
//     marginTop: height * 0.05,
//   },
//   appTitle: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#000',
//     marginVertical: height * 0.02,
//   },
//   registerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: width * 0.8,
//     height: 125,
//     backgroundColor: '#ffffff',
//     justifyContent: 'center',
//     borderRadius: 300,
//     borderWidth: 1,
//     borderColor: '#000',
//     marginVertical: height * 0.05,
//     top: -50,
//   },
//   registerImage: {
//     width: 60,
//     height: 80,
//     marginRight: 15,
//   },
//   registerButtonText: {
//     fontSize: 18,
//     color: '#000',
//     fontWeight: 'bold',
//   },
//   footer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: height * 0.05,
//   },
//   footerText: {
//     fontSize: 16,
//     color: '#000',
//   },
//   signInLink: {
//     fontSize: 16,
//     color: '#32CD32',
//     marginLeft: 5,
//     fontWeight: 'bold',
//   },
// });

// export default RegisterPage;





//with sos
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Vibration,
} from 'react-native';
import { useRouter } from 'expo-router'; // Import the useRouter hook
import * as Location from 'expo-location';
import { addDoc, collection } from 'firebase/firestore';
import { auth,db } from '../../constants/firebaseConfig'; // Firebase configuration

const { width, height } = Dimensions.get('window');

const RegisterPage = () => {
  const router = useRouter(); // Create a router instance
  const [sosTimeout, setSosTimeout] = React.useState<null | NodeJS.Timeout>(null);

  const [sosActive, setSosActive] = useState(false);

  // Navigation Handlers
  const user = () => {
    router.push('/Authentication/UserSignUp'); // Navigate to the User Sign Up page
  };

  const authorities = () => {
    router.push('/Authentication/AuthoritiesSignUp'); // Navigate to the Authorities Sign Up page
  };

  const SignInMainPage = () => {
    router.push('/Authentication/SignInMainPage'); // Navigate to the Sign In Main page
  };

  // SOS Button Handlers
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
          onPress: () => sendSosAlert('Tree Cutting'),
        },
        {
          text: 'Animal Poaching',
          onPress: () => sendSosAlert('Animal Poaching'),
        },
      ]
    );
  };

  const sendSosAlert = async (type: string) => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permissions are required for SOS alert.'
        );
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({});
      const user = auth.currentUser;
  
      if (user) {
        await addDoc(collection(db, 'SOS'), {
          name: 'Unknown User', // Replace with userInfo.Name if available
          phonenumber: 'Not provided', // Replace with userInfo.PhoneNum if available
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
      {/* Top Image */}
      <Image source={require('../../assets/Images/Pic1.png')} style={styles.topImage} />

      {/* App Name */}
      <Text style={styles.appTitle}>EcoAlert</Text>

      {/* Register Area with Image */}
      <TouchableOpacity style={[styles.registerContainer, { marginBottom: -20 }]} onPress={user}>
        <Image
          source={require('../../assets/Images/user.png')} // Update with your image path
          style={styles.registerImage}
        />
        <Text style={styles.registerButtonText}>Register as a User</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerContainer} onPress={authorities}>
        <Image
          source={require('../../assets/Images/autho.png')} // Update with your image path
          style={styles.registerImage}
        />
        <Text style={styles.registerButtonText}>Register as an Authority</Text>
      </TouchableOpacity>

      {/* Already have an account? Sign in */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={SignInMainPage}>
          <Text style={styles.signInLink}>Sign in</Text>
        </TouchableOpacity>
      </View>

      {/* SOS Button */}
      <TouchableOpacity
        style={styles.sosButton}
        onPressIn={handleSosPressIn}
        onPressOut={handleSosPressOut}
      >
        <Text style={styles.sosButtonText}>SOS (Hold for 3 sec)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: height * 0.05,
  },
  topImage: {
    width: width * 0.8, // 80% of screen width
    height: height * 0.3, // Adjusted height
    resizeMode: 'contain',
    marginTop: height * 0.05,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: height * 0.02,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.8,
    height: 125,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    borderRadius: 300,
    borderWidth: 1,
    borderColor: '#000',
    marginVertical: height * 0.05,
    top: -50,
  },
  registerImage: {
    width: 60,
    height: 80,
    marginRight: 15,
  },
  registerButtonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.05,
  },
  footerText: {
    fontSize: 16,
    color: '#000',
  },
  signInLink: {
    fontSize: 16,
    color: '#32CD32',
    marginLeft: 5,
    fontWeight: 'bold',
    
  },
  sosButton: {
    width: width * 0.6,
    height: 50,
    backgroundColor: '#ffe6e6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 125,
    marginBottom: height * 0.05,
    borderColor: 'red',
    borderWidth: 2,
    textAlign: 'center',
    top: -20,
    
  },
  sosButtonText: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
  },
});


export default RegisterPage;
