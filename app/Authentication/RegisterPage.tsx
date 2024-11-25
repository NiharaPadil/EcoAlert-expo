import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router'; // Import the useRouter hook

const { width, height } = Dimensions.get('window');

const RegisterPage = () => {
  const router = useRouter(); // Create a router instance

  const user = () => {
    router.push('/Authentication/UserSignUp'); // Navigate to the User Sign Up page
  };
  
  const authorities = () => {
    router.push('/Authentication/AuthoritiesSignUp'); // Navigate to the Authorities Sign Up page
  };

  const SignInMainPage = () => {
    router.push('/Authentication/SignInMainPage'); // Navigate to the Sign In Main page
  };

  return (
    <View style={styles.container}>
      {/* Top Image */}
      <Image source={require('../../assets/Images/Pic1.png')} style={styles.topImage} />

      {/* App Name */}
      <Text style={styles.appTitle}>EcoAlert</Text>

      {/* Register Area with Image */}
      <TouchableOpacity style={[styles.registerContainer, { marginBottom: -20 }]} onPress={user}>
        <Image
          source={require('../../assets/Images/user.png')} // Update with your image path
          style={styles.registerImage}
        />
        <Text style={styles.registerButtonText}>Register as a User</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerContainer} onPress={authorities}>
        <Image
          source={require('../../assets/Images/autho.png')} // Update with your image path
          style={styles.registerImage}
        />
        <Text style={styles.registerButtonText}>Register as an Authority</Text>
      </TouchableOpacity>

      {/* Already have an account? Sign in */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={SignInMainPage}>
          <Text style={styles.signInLink}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: height * 0.05,
  },
  topImage: {
    width: width * 0.8, // 80% of screen width
    height: height * 0.3, // Adjusted height
    resizeMode: 'contain',
    marginTop: height * 0.05,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: height * 0.02,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.8,
    height: 125,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    borderRadius: 300,
    borderWidth: 1,
    borderColor: '#000',
    marginVertical: height * 0.05,
    top: -50,
  },
  registerImage: {
    width: 60,
    height: 80,
    marginRight: 15,
  },
  registerButtonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.05,
  },
  footerText: {
    fontSize: 16,
    color: '#000',
  },
  signInLink: {
    fontSize: 16,
    color: '#32CD32',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export default RegisterPage;
