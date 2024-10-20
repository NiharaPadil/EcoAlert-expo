import React from 'react';
import { Pressable, View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';

// Get device dimensions for responsiveness
const { width, height } = Dimensions.get('window');

const AuthoritiesSignup = () => {
  const router = useRouter();

  const SignInMainPage = () => {
    router.push('./SignInMainPage'); // Use expo-router for navigation
  };

  const emailError = ''; // Placeholder for email error validation

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
            />
          ))}
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <TouchableOpacity style={styles.button}>
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
});

export default AuthoritiesSignup;
