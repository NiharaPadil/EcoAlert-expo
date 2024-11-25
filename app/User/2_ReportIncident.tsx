

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { requestCameraPermission } from '../../constants/permission'; // Update the path as necessary
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, storage } from '../../constants/firebaseConfig'; // Update with your Firebase config

export default function UploadScreen() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>(''); // Store location as a string
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [userData, setUserData] = useState<any>(null); // State for user data

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      const user = auth.currentUser; // Get the currently logged-in user
      if (user) {
        const userDoc = await getDoc(doc(db, 'UserData', user.uid)); // Fetch user data from Firestore
        if (userDoc.exists()) {
          console.log("Exists")
          setUserData(userDoc.data()); // Store user data in state
        } else {
          console.log('No such user document!');
        }
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
      
      setLocation(`${locationData.coords.latitude}, ${locationData.coords.longitude}`);
    };

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
      ],
      { cancelable: true }
    );
  };

  // Function to open the camera
  const openCamera = async () => {
    const permissionGranted = await requestCameraPermission(); // Use your custom permission function
    if (permissionGranted) {
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3] as [number, number],
        quality: 1,
      };

      const result = await ImagePicker.launchCameraAsync(options);
      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } else {
      Alert.alert('Permission Denied', 'Camera permission is required to take pictures.');
    }
  };

  // Function to open the image library
  const openImageLibrary = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3] as [number, number],
      quality: 1,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  // Function to handle submit
  const handleSubmit = async () => {
    if (!photo || !description || !location || !userData) {
      Alert.alert('Error', 'Please provide all details: image, description, location, and user data.');
      return;
    }

    // Upload the image to Firebase Storage
    const response = await fetch(photo);
    const blob = await response.blob();
    const filename = `${Date.now()}.jpg`; // Unique filename
    const storageRef = ref(storage, `images/${filename}`);

    try {
      // Upload image blob to Firebase Storage
      await uploadBytes(storageRef, blob);
      // Retrieve the download URL of the uploaded image
      const photoURL = await getDownloadURL(storageRef);

      // Store data in Firestore
      const incidentData = {
        timestamp: new Date(),
        assignedto: '',
        description: description,
        location: location, // Automatically fetched location
        photourl: photoURL,
        uid: userData.uid, // Automatically fetched user ID
        username: userData.username, // Automatically fetched username
        phonenumber: userData.phonenumber, // Automatically fetched phone number
      };

      await setDoc(doc(db, 'IncidentReports', filename), incidentData);
      Alert.alert('Success', 'Your report has been submitted successfully.');

      // Reset the form
      setPhoto(null);
      setDescription('');
      setLocation('');
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
      <View style={styles.labelContainer}>
        <Text style={styles.uploadLabel}>Click/Upload Picture</Text>
        <Image source={require('../../assets/Images/camera.png')} style={styles.cameraIcon} />
      </View>
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
  cameraIcon: {
    width: 28,
    height: 25,
    marginLeft: 10,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadLabel: {
    fontSize: 16,
    color: '#000',
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
