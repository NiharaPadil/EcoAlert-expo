import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { doc, GeoPoint, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, storage } from '../../constants/firebaseConfig'; // Ensure the correct import for Firebase

export default function UploadScreen() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<GeoPoint | null>(null); // Store location as a GeoPoint or null
  const [userData, setUserData] = useState<any>(null); // State for user data
  const [errorMsg, setErrorMsg] = useState<string>(''); // Error message state

  // Fetch user data when the component mounts
  const fetchUserData = async () => {
    const user = auth.currentUser; // Get the currently logged-in user
    if (user) {
      const userDoc = await getDoc(doc(db, 'UserData', user.uid)); // Fetch user data from Firestore
      if (userDoc.exists()) {
        console.log("User data exists:", userDoc.data());
        setUserData(userDoc.data()); // Store user data in state
      } else {
        console.log('No such user document!');
      }
    } else {
      console.log('User is not logged in.');
      Alert.alert('Error', 'User is not authenticated.');
    }
  };

  // Request location permission and fetch location
  const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Location permission not granted.');
      return;
    }

    let locationData = await Location.getCurrentPositionAsync({});
    setLocation(new GeoPoint(locationData.coords.latitude, locationData.coords.longitude));
  };

  useEffect(() => {
    fetchUserData(); // Call function to fetch user data
    fetchLocation(); // Call function to fetch location
  }, []);

  // Function to choose between camera and gallery
  const chooseImageSource = () => {
    Alert.alert(
      'Select Image Source',
      'Choose an option to upload an image',
      [
        { text: 'Take a Photo', onPress: openCamera },
        { text: 'Choose from Gallery', onPress: openImageLibrary },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Function to open the camera
  const openCamera = async () => {
    const permissionGranted = await ImagePicker.requestCameraPermissionsAsync(); // Check if permission is granted
    if (permissionGranted.granted) {
      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      };

      const result = await ImagePicker.launchCameraAsync(options);
      if (!result.canceled) {
        setPhoto(result.assets[0].uri); // Save photo URI
      }
    } else {
      Alert.alert('Permission Denied', 'Camera permission is required to take pictures.');
    }
  };

  // Function to open the image gallery
  const openImageLibrary = async () => {
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled) {
      setPhoto(result.assets[0].uri); // Save photo URI
    }
  };

  // Function to handle submit
  // Function to handle submit
const handleSubmit = async () => {
  if (!photo || !description || !location || !userData) {
    Alert.alert('Error', 'Please provide all details: image, description, location, and user data.');
    return;
  }

  // Log userData for debugging purposes
  console.log(userData);

  // Ensure that the necessary fields are available in userData
  if (!userData.userId || !userData.Name || !userData.PhoneNum) {
    Alert.alert('Error', 'Missing user data (userId, Name, or PhoneNum).');
    return;
  }

  // Upload the image to Firebase Storage
  const response = await fetch(photo);
  const blob = await response.blob();
  const filename = `${Date.now()}.jpg`; // Unique filename
  const storageRef = ref(storage, `incidents/${filename}`);

  try {
    // Upload image blob to Firebase Storage
    await uploadBytes(storageRef, blob);
    // Retrieve the download URL of the uploaded image
    const photoURL = await getDownloadURL(storageRef);

    // Store data in Firestore
    const incidentData = {
      timestamp: new Date(),
      description: description,
      location: location, // Automatically fetched location
      photourl: photoURL,
      uid: userData.userId, // Updated field name
      username: userData.Name, // Updated field name
      phonenumber: userData.PhoneNum, // Updated field name
    };

    await setDoc(doc(db, 'IncidentReports', filename), incidentData);
    Alert.alert('Success', 'Your report has been submitted successfully.');

    // Reset the form
    setPhoto(null);
    setDescription('');
    setLocation(null);
  } catch (error) {
    console.error('Error uploading image or saving data:', error);
    Alert.alert('Error', 'An error occurred while submitting your report.');
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.header}>EcoAlert</Text>
      <Image source={require('../../assets/Images/Forest.png')} style={styles.topImage} />

      <TouchableOpacity style={styles.uploadButton} onPress={chooseImageSource}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.uploadedImage} />
        ) : (
          <Text style={styles.plusSign}>+</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.textInput}
        placeholder="Write Description..."
        multiline={true}
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {errorMsg ? <Text>{errorMsg}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  header: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    marginTop: 40,
  },
  topImage: {
    width: 250,
    height: 280,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#658f6a',
    width: 150,
    height: 90,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  plusSign: {
    fontSize: 50,
    color: '#000',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  textInput: {
    width: '80%',
    height: 150,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#F0FFF0',
    marginBottom: 20,
    marginTop: 20,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: 'white',
    borderColor: 'green',
    borderWidth: 2,
    width: 150,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 18,
    color: 'green',
    fontWeight: 'bold',
  },
});
