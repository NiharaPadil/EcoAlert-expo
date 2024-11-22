import React, { useState } from 'react';
import { Alert, View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions, Pressable } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router'; 
import { db, auth } from '../../constants/firebaseConfig';
import { collection, addDoc ,setDoc,doc} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const { width, height } = Dimensions.get('window');

const UserSignUp = () => {
  const router = useRouter(); // Initialize the router
  // State variables for form fields
  const [name, setName] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');


  const SignInMainPage = () => {
    router.push('/Authentication/SignInMainPage'); // Use router to navigate
  };

  // Function to handle registration and store user data in Firestore
  const handleRegister = async () => {
    // Basic validation
    if (!name || !phoneNum || !email || !address || !password) {
      Alert.alert('Please fill out all fields.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Password must be at least 6 characters long.');
      return; // Exit the function if the password length is less than 6
    }

    try {
      // Create the user with email and password authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;

      // After successfully creating the user, add user details to Firestore
      
      await setDoc(doc(db,"UserData",user.uid), {
        Name: name,
        PhoneNum: phoneNum,
        Email: email,
        Address: address,
        Role: 'user', // Default role
        userId: userCredential.user.uid, // Store Firebase UID
        Password:password
      });

      Alert.alert('User registered successfully!');
      router.push('/Authentication/SignInMainPage'); // Navigate to the sign-in page using router
    } catch (error) {
      console.error('Error registering user: ', error);
      Alert.alert('Error registering user. Please try again.');
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        {/* Image at the top */}
        <Image source={require('../../assets/Images/SignupIcon.png')} style={styles.topImage} />

        {/* App Name */}
        <Text style={styles.appTitle}>User SignUp</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={text => setName(text)}
            style={styles.input}
            placeholderTextColor="#a9a9a9"
          />
          <TextInput
            placeholder="Phone Number"
            value={phoneNum}
            onChangeText={text => setPhoneNum(text)}
            style={styles.input}
            placeholderTextColor="#a9a9a9"
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            style={[styles.input, emailError ? styles.errorInput : null]}
            placeholderTextColor="#a9a9a9"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <TextInput
            placeholder="Address"
            value={address}
            onChangeText={text => setAddress(text)}
            style={styles.input}
            placeholderTextColor="#a9a9a9"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.input}
            secureTextEntry
            placeholderTextColor="#a9a9a9"
          />

          <TouchableOpacity onPress={handleRegister} style={styles.button}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable onPress={SignInMainPage}>
            <Text style={styles.signInText}>
              Sign In
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    justifyContent: 'center',
  },
  topImage: {
    width: width * 0.7, // 70% of screen width
    height: height * 0.25, // 25% of screen height
    resizeMode: 'contain',
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    color: 'black',
  },
  errorInput: {
    borderColor: 'red',
  }, 
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'green', // Primary button color
    paddingVertical: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: 'white', // Button text color
    fontWeight: 'bold',
    fontSize: 18,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    marginTop: -5,
    textAlign: 'center',
  },
  signInText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'green',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  inputContainer: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default UserSignUp;
