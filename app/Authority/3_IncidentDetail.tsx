




//POP UP
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Image, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { db } from '../../constants/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import MapView, { Marker } from 'react-native-maps';

interface IncidentReport {
  id: string;
  title: string;
  description: string;
  status: string;
  timestamp: string;
  location: { latitude: number; longitude: number };
  phoneNumber: string;
  assignedTo: string;
  photoUrl: string;
}

const IncidentDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [incident, setIncident] = useState<IncidentReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncident = async () => {
      if (!id) return;
      const docRef = doc(db, 'IncidentReports', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const docData = docSnap.data();

        const timestamp = docData.Time;
        const formattedTimestamp = timestamp
          ? moment(new Date(timestamp.seconds * 1000)).format('MMM D, YYYY h:mm A')
          : 'Unknown Time';

        setIncident({
          id: docSnap.id,
          title: docData.title || 'No Title',
          description: docData.description || 'No Description',
          status: docData.status || 'Unknown',
          timestamp: formattedTimestamp,
          location: docData.location || { latitude: 0, longitude: 0 },
          phoneNumber: docData.PhoneNumber || 'Unknown',
          assignedTo: docData.assigneto || 'Unassigned',
          photoUrl: docData.photourl || '',
        });
      } else {
        console.log('No such Incident report!');
      }
      setLoading(false);
    };

    fetchIncident();
  }, [id]);

  // Function to handle the "Handled" status update
  const handleStatusUpdate = async () => {
    if (!incident) return;
    const docRef = doc(db, 'IncidentReports', incident.id);
    await updateDoc(docRef, { status: 'Handled' });  // Update the status to 'Handled'

    // Update the local state to reflect the change
    setIncident((prevIncident) => prevIncident ? { ...prevIncident, status: 'Handled' } : null);

    // Show the success alert after the status is updated
    Alert.alert(
      'Status Updated', // Alert title
      'The incident status has been updated to "Handled".', // Alert message
      [{ text: 'OK' }] // Button to close the alert
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!incident) {
    return (
      <View style={styles.scrollContainer}>
        <Text>No Incident report found!</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>{incident.title}</Text>
      <Text style={styles.label}>Description: <Text style={styles.value}>{incident.description}</Text></Text>
      <Text style={styles.label}>Reporter: <Text style={styles.value}>{incident.assignedTo}</Text></Text>
      <Text style={styles.label}>Contact: <Text style={styles.value}>{incident.phoneNumber}</Text></Text>
      <Text style={styles.label}>Status: <Text style={styles.value}>{incident.status}</Text></Text>
      <Text style={styles.label}>Timestamp: <Text style={styles.value}>{incident.timestamp}</Text></Text>

      {/* Display the photo URL if available */}
      {incident.photoUrl ? (
        <Image source={{ uri: incident.photoUrl }} style={styles.image} />
      ) : (
        <Text>No image available</Text>
      )}

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: incident.location.latitude,
          longitude: incident.location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{
            latitude: incident.location.latitude,
            longitude: incident.location.longitude,
          }}
          title="Incident Location"
          description="Location of the reported incident."
        />
      </MapView>

      {/* Button to update the incident status */}
      <View style={styles.buttonContainer}>
        <Button title="Mark as Handled" onPress={handleStatusUpdate} color="#4CAF50"/>
      </View>

      {/* Button to go back with additional spacing */}
      <View style={styles.buttonContainer}>
        <Button title="Go Back" onPress={() => router.back()} color="#4CAF50"/>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
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
  map: {
    width: '100%',
    height: 400,
    marginVertical: 16,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginVertical: 16,
  },
  buttonContainer: {
    marginVertical: 8, // Adds vertical spacing between buttons
  },
});

export default IncidentDetail;
