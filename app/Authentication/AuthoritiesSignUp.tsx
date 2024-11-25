

import React, { useState } from 'react';
import { Alert, View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions, Pressable } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
import { db, auth } from '../../constants/firebaseConfig';
import { collection, addDoc,setDoc,doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const { width, height } = Dimensions.get('window');

const AuthoritiesSignup = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [designation, setDesignation] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  const SignInMainPage = () => {
    router.push('/Authentication/SignInMainPage'); 
  };

  const handleRegister = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

 
    if (!name || !organisation || !designation || !phoneNum || !email || !password) {
      Alert.alert('Please fill out all fields.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Password must be at least 6 characters long.');
      return; 
    }

    
    if (!emailPattern.test(email)) {
      setEmailError('Please enter a valid email.');
      return;
    } else {
      setEmailError('');
    }

    try {
      const AuthorityCredential = await createUserWithEmailAndPassword(auth, email, password);

      const user = AuthorityCredential.user;

      await setDoc(doc(db,"AuthorityData",user.uid), {
        Name: name,
        Organisation: organisation,
        Designation: designation,
        PhoneNum: phoneNum,
        Email: email,
        Role: 'Authority', 
        AuthorityId: AuthorityCredential.user.uid,
        Password: password
      });

      Alert.alert('Authority registered successfully!');
      router.push('/Authentication/SignInMainPage'); 
    } catch (error) {
      console.error('Error registering Authority: ', error);
      Alert.alert('Error registering Authority. Please try again.');
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        {/* Image at the top */}
        <Image source={require('../../assets/Images/SignupIcon.png')} style={styles.topImage} />

        {/* App Name */}
        <Text style={styles.appTitle}>Authorities SignUp</Text>

        <View style={styles.inputContainer}>
          {['Name', 'Organisation Id', 'Designation', 'Phone Number', 'Email', 'Password'].map((placeholder, index) => (
            <TextInput
              key={index}
              placeholder={placeholder}
              style={[styles.input, placeholder === 'Email' && emailError ? styles.errorInput : null]}
              placeholderTextColor="#a9a9a9"
              secureTextEntry={placeholder === 'Password'}
              value={
                placeholder === 'Name' ? name :
                placeholder === 'Organisation Id' ? organisation :
                placeholder === 'Designation' ? designation :
                placeholder === 'Phone Number' ? phoneNum :
                placeholder === 'Email' ? email :
                placeholder === 'Password' ? password :
                ''
              }
              onChangeText={
                placeholder === 'Name' ? setName :
                placeholder === 'Organisation Id' ? setOrganisation :
                placeholder === 'Designation' ? setDesignation :
                placeholder === 'Phone Number' ? setPhoneNum :
                placeholder === 'Email' ? setEmail :
                placeholder === 'Password' ? setPassword :
                () => {}
              }
            />
          ))}
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable onPress={SignInMainPage}>
            <Text style={styles.signInText}>Sign In</Text>
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
  inputContainer: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 20,
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
    backgroundColor: 'green',
    paddingVertical: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
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
});

export default AuthoritiesSignup;


