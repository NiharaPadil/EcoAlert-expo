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
  confidence: number;
  label: string;
  status: string; // Assuming there's a 'status' field in the document
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

        const timestamp = docData.timestamp || docData.Time;
        const formattedTimestamp = timestamp
          ? moment(new Date(timestamp.seconds * 1000)).format('MMM D, YYYY h:mm A')
          : 'Unknown Time';

        setCapturedImage({
          id: docSnap.id,
          timestamp: formattedTimestamp,
          photoUrl: docData.image_url || '',
          location: docData.location || { latitude: 0, longitude: 0 },
          confidence: docData.confidence || 0,
          label: docData.label || 'Unknown',
          status: docData.status || 'Pending',
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
      status: 'Handled', // Update the status field
    });

    setCapturedImage(prevState =>
      prevState ? { ...prevState, status: 'Handled' } : null
    );
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
      <Text style={styles.label}>
        Timestamp: <Text style={styles.value}>{capturedImage.timestamp}</Text>
      </Text>
      <Text style={styles.label}>
        Confidence: <Text style={styles.value}>{capturedImage.confidence.toFixed(2)}%</Text>
      </Text>
      <Text style={styles.label}>
        Label: <Text style={styles.value}>{capturedImage.label}</Text>
      </Text>

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

      {capturedImage.status === 'Pending' && (
        <View style={styles.buttonContainer}>
          <Button
            title="Mark as Handled"
            onPress={handleStatusUpdate}
            color="#4CAF50"
          />
        </View>
      )}

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
    marginVertical: 8,
  },
});

export default CapturedImageDetail;
