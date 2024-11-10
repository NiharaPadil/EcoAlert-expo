// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Image, Button, ActivityIndicator } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { db } from '../../constants/firebaseConfig';
// import { doc, getDoc } from 'firebase/firestore';
// import moment from 'moment';

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
//           latitude: docData.latitude,
//           longitude: docData.longitude,
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
// });

// export default SOSDetail;

// import React from 'react';
// import MapView from 'react-native-maps';
// import { StyleSheet, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <MapView style={styles.map} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     width: '100%',
//     height: '100%',
//   },
// });

// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { db } from '../../constants/firebaseConfig';
// import { doc, getDoc } from 'firebase/firestore';
// import moment from 'moment';
// import MapView, { Marker } from 'react-native-maps';

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

// const authorityLocation = {
//   latitude: 12.9715987, // Replace with actual authority latitude
//   longitude: 77.5945627, // Replace with actual authority longitude
// };

// const SOSDetail = () => {
//   const router = useRouter();
//   const { id } = useLocalSearchParams(); // Get SOS id from route parameters
//   const [sos, setSOS] = useState<SOS | null>(null);
//   const [loading, setLoading] = useState(true); // Loading state
//   const [travelTime, setTravelTime] = useState<string | null>(null); // State for travel time

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
//         <Marker
//           coordinate={authorityLocation}
//           title="Authority Location"
//           description="This is the location of the authority."
//         />
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


import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { db } from '../../constants/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
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
});

export default SOSDetail;
