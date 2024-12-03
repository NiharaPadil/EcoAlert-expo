// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator, Button, Image, ScrollView, Alert } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { db } from '../../constants/firebaseConfig';
// import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import moment from 'moment';
// import MapView, { Marker } from 'react-native-maps';

// interface CapturedImage {
//   id: string;
//   timestamp: string;
//   photoUrl: string;
//   location: { latitude: number; longitude: number };
//   status: string;
// }

// const CapturedImageDetail = () => {
//   const router = useRouter();
//   const { id } = useLocalSearchParams();
//   const [capturedImage, setCapturedImage] = useState<CapturedImage | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isHandled, setIsHandled] = useState(false);

//   useEffect(() => {
//     const fetchCapturedImage = async () => {
//       if (!id) return;
//       const docRef = doc(db, 'CapturedImages', id as string);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         const docData = docSnap.data();

//         const timestamp = docData.Time;
//         const formattedTimestamp = timestamp
//           ? moment(new Date(timestamp.seconds * 1000)).format('MMM D, YYYY h:mm A')
//           : 'Unknown Time';

//         setCapturedImage({
//           id: docSnap.id,
//           timestamp: formattedTimestamp,
//           photoUrl: docData.Photo || '',
//           location: docData.Location || { latitude: 0, longitude: 0 },
//           status: docData.status || 'Unresolved',
//         });
//         setIsHandled(docData.status === 'Handled');  // Check if the status is already handled
//       } else {
//         console.log('No such captured image!');
//       }
//       setLoading(false);
//     };

//     fetchCapturedImage();
//   }, [id]);

//   // Function to handle the "Handled" status update
//   const handleStatusUpdate = async () => {
//     if (!capturedImage) return;
//     const docRef = doc(db, 'CapturedImages', capturedImage.id);
//     await updateDoc(docRef, { status: 'Handled' });  // Update the status to 'Handled'

//     // Update the local state to reflect the change
//     setCapturedImage((prevImage) => prevImage ? { ...prevImage, status: 'Handled' } : null);
//     setIsHandled(true);

//     // Show the success alert after the status is updated
//     Alert.alert(
//       'Status Updated',
//       'The captured image status has been updated to "Handled".',
//       [{ text: 'OK' }]
//     );
//   };

//   if (loading) {
//     return <ActivityIndicator size="large" color="#0000ff" />;
//   }

//   if (!capturedImage) {
//     return (
//       <View style={styles.scrollContainer}>
//         <Text>No captured image found!</Text>
//         <Button title="Go Back" onPress={() => router.back()} />
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <Text style={styles.title}>Captured Image Details</Text>
//       <Text style={styles.label}>Timestamp: <Text style={styles.value}>{capturedImage.timestamp}</Text></Text>

//       {/* Display the photo URL if available */}
//       {capturedImage.photoUrl ? (
//         <Image source={{ uri: capturedImage.photoUrl }} style={styles.image} />
//       ) : (
//         <Text>No image available</Text>
//       )}

//       {/* Map to display the captured image location */}
//       <MapView
//         style={styles.map}
//         initialRegion={{
//           latitude: capturedImage.location.latitude,
//           longitude: capturedImage.location.longitude,
//           latitudeDelta: 0.05,
//           longitudeDelta: 0.05,
//         }}
//       >
//         <Marker
//           coordinate={{
//             latitude: capturedImage.location.latitude,
//             longitude: capturedImage.location.longitude,
//           }}
//           title="Captured Image Location"
//           description="Location where the image was captured."
//         />
//       </MapView>

//       {/* Button to update the incident status */}
//       {!isHandled && (
//         <View style={styles.buttonContainer}>
//           <Button title="Mark as Handled" onPress={handleStatusUpdate} color="#4CAF50"/>
//         </View>
//       )}

//       {/* Button to go back */}
//       <View style={styles.buttonContainer}>
//         <Button title="Go Back" onPress={() => router.back()} color="#4CAF50"/>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: {
//     padding: 16,
//     backgroundColor: 'white',
//     flexGrow: 1,
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
//   image: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//     marginVertical: 16,
//   },
//   map: {
//     width: '100%',
//     height: 400,
//     marginVertical: 16,
//   },
//   buttonContainer: {
//     marginVertical: 8, // Adds vertical spacing between buttons
//   },
// });

// export default CapturedImageDetail;



///ew

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Image, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { db } from '../../constants/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import MapView, { Marker } from 'react-native-maps';

interface CapturedImage {
  id: string;
  timestamp: string;
  photoUrl: string;
  location: { latitude: number; longitude: number };
  status: string;  // Assuming there's a 'status' field in the document
}

const CapturedImageDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [capturedImage, setCapturedImage] = useState<CapturedImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCapturedImage = async () => {
      if (!id) return;
      const docRef = doc(db, 'CapturedImages', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const docData = docSnap.data();

        const timestamp = docData.Time; // Assuming 'Time' is the field name for the timestamp
        const formattedTimestamp = timestamp
          ? moment(new Date(timestamp.seconds * 1000)).format('MMM D, YYYY h:mm A')
          : 'Unknown Time';

        setCapturedImage({
          id: docSnap.id,
          timestamp: formattedTimestamp,
          photoUrl: docData.image_url || '', // Assuming 'Photo' is the field name for the photo URL
          location: docData.Location || { latitude: 0, longitude: 0 }, // Assuming 'Location' is the field name for the location
          status: docData.Status || 'Pending', // Assuming 'Status' is the field name for the status
        });
      } else {
        console.log('No such captured image!');
      }
      setLoading(false);
    };

    fetchCapturedImage();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!capturedImage) return;
    
    const docRef = doc(db, 'CapturedImages', capturedImage.id);
    await updateDoc(docRef, {
      Status: 'Handled',  // Update the status field
    });

    // Update the state to hide the "Handled" button after the update
    setCapturedImage(prevState => prevState ? { ...prevState, status: 'Handled' } : null);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!capturedImage) {
    return (
      <View style={styles.scrollContainer}>
        <Text>No captured image found!</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Forest Image Details</Text>
      <Text style={styles.label}>Timestamp: <Text style={styles.value}>{capturedImage.timestamp}</Text></Text>

      {/* Display the photo URL if available */}
      {capturedImage.photoUrl ? (
        <Image source={{ uri: capturedImage.photoUrl }} style={styles.image} />
      ) : (
        <Text>No image available</Text>
      )}

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: capturedImage.location.latitude,
          longitude: capturedImage.location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{
            latitude: capturedImage.location.latitude,
            longitude: capturedImage.location.longitude,
          }}
          title="Captured Image Location"
          description="Location of the captured image."
        />
      </MapView>

      {/* Handled Button */}
      {capturedImage.status === 'Pending' && (
        <View style={styles.buttonContainer}>
          <Button title="Mark as Handled" onPress={handleStatusUpdate} color="#4CAF50" />
        </View>
      )}

      {/* Go Back Button */}
      <View style={styles.buttonContainer}>
        <Button title="Go Back" onPress={() => router.back()} color="#4CAF50" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 36,
    paddingTop: 76,
    backgroundColor: 'white',
    flexGrow: 1,
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
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginVertical: 16,
  },
  map: {
    width: '100%',
    height: 400,
    marginVertical: 16,
  },
  buttonContainer: {
    marginVertical: 8, // Adds vertical spacing between buttons
    marginBottom: 16, // Ensures the button stays visible even when scrolling
  },
});

export default CapturedImageDetail;
