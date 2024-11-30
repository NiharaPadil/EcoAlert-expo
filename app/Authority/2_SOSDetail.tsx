


// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { db } from '../../constants/firebaseConfig';
// import { doc, getDoc } from 'firebase/firestore';
// import moment from 'moment';
// import MapView, { Marker } from 'react-native-maps';
// import * as Location from 'expo-location';

// interface SOS {
//   id: string;
//   latitude: number;
//   longitude: number;
//   name: string;
//   phonenumber: string;
//   status: string;
//   timestamp: string;
//   type: string;
//   userid: string;
// }

// const SOSDetail = () => {
//   const router = useRouter();
//   const { id } = useLocalSearchParams(); // Get SOS id from route parameters
//   const [sos, setSOS] = useState<SOS | null>(null);
//   const [loading, setLoading] = useState(true); // Loading state
//   const [authorityLocation, setAuthorityLocation] = useState<{ latitude: number; longitude: number } | null>(null); // State for authority location

//   useEffect(() => {
//     const fetchSOS = async () => {
//       if (!id) return; // Ensure id is present before fetching
//       const docRef = doc(db, 'SOS', id as string);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         const docData = docSnap.data();
//         const formattedTimestamp = docData.timestamp
//           ? moment(new Date(docData.timestamp.seconds * 1000)).format('MMM D, YYYY h:mm A')
//           : 'Unknown Time';

//         setSOS({
//           id: docSnap.id,
//           latitude: docData.location.latitude,
//           longitude: docData.location.longitude,
//           name: docData.name,
//           phonenumber: docData.phonenumber,
//           status: docData.status,
//           timestamp: formattedTimestamp,
//           type: docData.type,
//           userid: docData.userid,
//         });
//       } else {
//         console.log('No such SOS document!');
//       }
//       setLoading(false); // Set loading to false after fetching
//     };

//     fetchSOS();
//   }, [id]);

//   useEffect(() => {
//     const getAuthorityLocation = async () => {
//       // Request permission to access location
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         console.log('Permission to access location was denied');
//         return;
//       }

//       // Get the current location
//       let location = await Location.getCurrentPositionAsync({});
//       setAuthorityLocation({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       });
//     };

//     getAuthorityLocation();
//   }, []);

//   // Loading state handling
//   if (loading) {
//     return <ActivityIndicator size="large" color="#0000ff" />;
//   }

//   if (!sos) {
//     return (
//       <View style={styles.container}>
//         <Text>No SOS request found!</Text>
//         <Button title="Go Back" onPress={() => router.back()} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>SOS Request Details</Text>
//       <Text style={styles.label}>Name: <Text style={styles.value}>{sos.name}</Text></Text>
//       <Text style={styles.label}>Phone Number: <Text style={styles.value}>{sos.phonenumber}</Text></Text>
//       <Text style={styles.label}>Status: <Text style={styles.value}>{sos.status}</Text></Text>
//       <Text style={styles.label}>Location: <Text style={styles.value}>Lat: {sos.latitude}, Lon: {sos.longitude}</Text></Text>
//       <Text style={styles.label}>Type: <Text style={styles.value}>{sos.type}</Text></Text>
//       <Text style={styles.label}>User ID: <Text style={styles.value}>{sos.userid}</Text></Text>
//       <Text style={styles.label}>Timestamp: <Text style={styles.value}>{sos.timestamp}</Text></Text>

//       {/* Map View */}
//       <MapView
//         style={styles.map}
//         initialRegion={{
//           latitude: sos.latitude,
//           longitude: sos.longitude,
//           latitudeDelta: 0.05,
//           longitudeDelta: 0.05,
//         }}
//       >
//         {/* SOS Location Marker */}
//         <Marker
//           coordinate={{ latitude: sos.latitude, longitude: sos.longitude }}
//           title="SOS Location"
//           description="This is the location of the SOS request."
//         />
        
//         {/* Authority Location Marker */}
//         {authorityLocation && (
//           <Marker 
//             coordinate={authorityLocation}
//             title="Your Location"
//             description="This is your current location."
//           />
//         )}
//       </MapView>

//       <Button title="Go Back" onPress={() => router.back()} />
//     </View>
//   );
// };

// // Define your styles
// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: 'white',
//     height: '100%',
//   },
  
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginVertical: 4,
//   },
//   value: {
//     fontWeight: 'normal',
//   },
//   map: {
//     width: '100%',
//     height: 500, // Adjust height as necessary
//     marginVertical: 16,
//   },
// });

// export default SOSDetail;


//with alert messages handling
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { db } from '../../constants/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

interface SOS {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  phonenumber: string;
  status: string;
  timestamp: string;
  type: string;
  userid: string;
}

const SOSDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Get SOS id from route parameters
  const [sos, setSOS] = useState<SOS | null>(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [authorityLocation, setAuthorityLocation] = useState<{ latitude: number; longitude: number } | null>(null); // State for authority location

  useEffect(() => {
    const fetchSOS = async () => {
      if (!id) return; // Ensure id is present before fetching
      const docRef = doc(db, 'SOS', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const docData = docSnap.data();
        const formattedTimestamp = docData.timestamp
          ? moment(new Date(docData.timestamp.seconds * 1000)).format('MMM D, YYYY h:mm A')
          : 'Unknown Time';

        setSOS({
          id: docSnap.id,
          latitude: docData.location.latitude,
          longitude: docData.location.longitude,
          name: docData.name,
          phonenumber: docData.phonenumber,
          status: docData.status,
          timestamp: formattedTimestamp,
          type: docData.type,
          userid: docData.userid,
        });
      } else {
        console.log('No such SOS document!');
      }
      setLoading(false); // Set loading to false after fetching
    };

    fetchSOS();
  }, [id]);

  useEffect(() => {
    const getAuthorityLocation = async () => {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      // Get the current location
      let location = await Location.getCurrentPositionAsync({});
      setAuthorityLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    getAuthorityLocation();
  }, []);

  // Loading state handling
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!sos) {
    return (
      <View style={styles.container}>
        <Text>No SOS request found!</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  // Function to handle the "Handled" status update
  const handleStatusUpdate = async () => {
    if (!sos) return;

    const docRef = doc(db, 'SOS', sos.id);
    await updateDoc(docRef, { status: 'Handled' }); // Update the status to 'Handled'

    // Update the local state to reflect the change
    setSOS((prevSOS) => prevSOS ? { ...prevSOS, status: 'Handled' } : null);

    // Show the success alert after the status is updated
    Alert.alert(
      'Status Updated', // Alert title
      'The SOS request status has been updated to "Handled".', // Alert message
      [{ text: 'OK' }] // Button to close the alert
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SOS Request Details</Text>
      <Text style={styles.label}>Name: <Text style={styles.value}>{sos.name}</Text></Text>
      <Text style={styles.label}>Phone Number: <Text style={styles.value}>{sos.phonenumber}</Text></Text>
      <Text style={styles.label}>Status: <Text style={styles.value}>{sos.status}</Text></Text>
      <Text style={styles.label}>Location: <Text style={styles.value}>Lat: {sos.latitude}, Lon: {sos.longitude}</Text></Text>
      <Text style={styles.label}>Type: <Text style={styles.value}>{sos.type}</Text></Text>
      <Text style={styles.label}>User ID: <Text style={styles.value}>{sos.userid}</Text></Text>
      <Text style={styles.label}>Timestamp: <Text style={styles.value}>{sos.timestamp}</Text></Text>

      {/* Map View */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: sos.latitude,
          longitude: sos.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* SOS Location Marker */}
        <Marker
          coordinate={{ latitude: sos.latitude, longitude: sos.longitude }}
          title="SOS Location"
          description="This is the location of the SOS request."
        />
        
        {/* Authority Location Marker */}
        {authorityLocation && (
          <Marker 
            coordinate={authorityLocation}
            title="Your Location"
            description="This is your current location."
          />
        )}
      </MapView>

      {/* Button to update the status to "Handled" */}
      <Button title="Mark as Handled" onPress={handleStatusUpdate} />
      
      {/* Spacer for some distance between buttons */}
      <View style={styles.buttonSpacer} />

      <Button title="Go Back" onPress={() => router.back()} />
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
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  value: {
    fontWeight: 'normal',
  },
  map: {
    width: '100%',
    height: 500, // Adjust height as necessary
    marginVertical: 16,
  },
  buttonSpacer: {
    marginVertical: 10, // Add some spacing between the buttons
  },
});

export default SOSDetail;
