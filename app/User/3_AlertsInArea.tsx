import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../constants/firebaseConfig";
import MapView, { Marker } from "react-native-maps";
import { ScrollView } from "react-native-reanimated/lib/typescript/Animated";

const AlertsInArea = () => {
  interface Report {
    id: string;
    PhoneNumber: string;
    timestamp: { seconds: number }; // Adjusted to Firestore Timestamp
    assignedto?: string;
    description: string;
    location: { latitude: number; longitude: number };
    photourl: string;
  }
  
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Fetch data in real time from Firestore
    const unsubscribe = onSnapshot(collection(db, "IncidentReports"), (snapshot) => {
      const fetchedReports = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          PhoneNumber: data.phonenumber,
          timestamp: data.timestamp, // Firestore timestamp
          assignedto: data.assignedto,
          description: data.description,
          location: data.location,
          photourl: data.photourl,
        } as Report;
      });
      setReports(fetchedReports);
    });

    return unsubscribe; // Clean up listener on unmount
  }, []);

  const handleCardPress = (report: Report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const renderCard = ({ item }: { item: Report }) => {
    const { PhoneNumber, timestamp, assignedto, description, location, photourl } = item;

    // Safely access the timestamp and format it
    const timeString = timestamp ? new Date(timestamp.seconds * 1000).toLocaleString() : "Time not available";

    return (
      <TouchableOpacity onPress={() => handleCardPress(item)}>
        <View style={styles.card}>
          <Image source={{ uri: photourl }} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.text}>
              <Text style={styles.bold}>Phone:</Text> {PhoneNumber}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Assigned To:</Text> {assignedto || "Not Assigned"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Description:</Text> {description}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Location:</Text> {`Lat: ${location.latitude}, Lon: ${location.longitude}`}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Time:</Text> {timeString}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {selectedReport && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: selectedReport.location.latitude,
                longitude: selectedReport.location.longitude,
                latitudeDelta: 0.01, // Zoom level
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: selectedReport.location.latitude,
                  longitude: selectedReport.location.longitude,
                }}
                title={selectedReport.description}
                description={`Reported by ${selectedReport.PhoneNumber}`}
              />
            </MapView>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                <Text style={styles.bold}>Phone:</Text> {selectedReport.PhoneNumber}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.bold}>Assigned To:</Text> {selectedReport.assignedto || "Not Assigned"}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.bold}>Description:</Text> {selectedReport.description}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.bold}>Time:</Text>{" "}
                {new Date(selectedReport.timestamp.seconds * 1000).toLocaleString()}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 10,
    paddingTop: 90,
    paddingLeft: 20,
    paddingRight: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  text: {
    marginBottom: 5,
    fontSize: 14,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    position: "absolute",
    bottom: 40,
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 28,
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  map: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.6,
    top: -90,
  },
});

export default AlertsInArea;
