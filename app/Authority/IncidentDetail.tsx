import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { db } from '../../constants/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import moment from 'moment';
import MapView, { Marker } from 'react-native-maps';

interface Incident {
  id: string;
  title: string;
  description: string;
  status: string;
  timestamp: string;
  location: { latitude: number; longitude: number };
  reporterName: string;
  contactNumber: string;
}

const IncidentDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncident = async () => {
      if (!id) return;
      const docRef = doc(db, 'IncidentReports', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const docData = docSnap.data();
        const formattedTimestamp = docData.timestamp
          ? moment(new Date(docData.timestamp.seconds * 1000)).format('MMM D, YYYY h:mm A')
          : 'Unknown Time';

        setIncident({
          id: docSnap.id,
          title: docData.title,
          description: docData.description,
          status: docData.status,
          timestamp: formattedTimestamp,
          location: docData.location,
          reporterName: docData.reporterName,
          contactNumber: docData.contactNumber,
        });
      } else {
        console.log('No such Incident report!');
      }
      setLoading(false);
    };

    fetchIncident();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!incident) {
    return (
      <View style={styles.container}>
        <Text>No Incident report found!</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{incident.title}</Text>
      <Text style={styles.label}>Description: <Text style={styles.value}>{incident.description}</Text></Text>
      <Text style={styles.label}>Reporter: <Text style={styles.value}>{incident.reporterName}</Text></Text>
      <Text style={styles.label}>Contact: <Text style={styles.value}>{incident.contactNumber}</Text></Text>
      <Text style={styles.label}>Status: <Text style={styles.value}>{incident.status}</Text></Text>
      <Text style={styles.label}>Timestamp: <Text style={styles.value}>{incident.timestamp}</Text></Text>

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

      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: 'white', height: '100%' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 16, fontWeight: 'bold', marginVertical: 4 },
  value: { fontWeight: 'normal' },
  map: { width: '100%', height: 400, marginVertical: 16 },
});

export default IncidentDetail;
