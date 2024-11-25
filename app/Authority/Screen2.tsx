import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { db } from '../../constants/firebaseConfig';
import { collection, onSnapshot, DocumentData } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import moment from 'moment';

interface IncidentReport {
  id: string;
  title: string;
  description: string;
  status: string;
  timestamp: string;
  location: { latitude: number; longitude: number };
  reporterName: string;
  contactNumber: string;
}

const IncidentReports = () => {
  const router = useRouter();
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'IncidentReports'), (snapshot) => {
      const fetchedReports = snapshot.docs.map((doc) => {
        const docData = doc.data() as DocumentData;
        const formattedTimestamp = docData.timestamp
          ? moment(new Date(docData.timestamp.seconds * 1000)).format('MMM D, YYYY h:mm A')
          : 'Unknown Time';

        return {
          id: doc.id,
          title: docData.title,
          description: docData.description,
          status: docData.status,
          timestamp: formattedTimestamp,
          location: docData.location,
          reporterName: docData.reporterName,
          contactNumber: docData.contactNumber,
        } as IncidentReport;
      });

      setIncidentReports(fetchedReports);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleViewDetails = (report: IncidentReport) => {
    router.push(`./IncidentDetail?id=${report.id}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          incidentReports.map((report) => (
            <View key={report.id} style={styles.card}>
              <Text style={styles.title}>{report.title}</Text>
              <Text style={styles.timestamp}>{report.timestamp}</Text>
              <Text style={styles.status}>Status: {report.status}</Text>
              <Text style={styles.content}>Reporter: {report.reporterName}</Text>
              <Text style={styles.content}>Contact: {report.contactNumber}</Text>
              <TouchableOpacity
                onPress={() => handleViewDetails(report)}
                style={styles.viewDetailsButton}
              >
                <Text style={styles.viewDetailsText}>VIEW DETAILS</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  scrollContainer: { padding: 16 },
  card: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  timestamp: { fontSize: 12, color: '#999', marginBottom: 8 },
  status: { fontSize: 14, color: '#333' },
  content: { fontSize: 14, color: '#333', marginBottom: 4 },
  viewDetailsButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  viewDetailsText: { color: 'white', fontWeight: 'bold' },
});

export default IncidentReports;
