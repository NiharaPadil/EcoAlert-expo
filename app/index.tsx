import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SplashScreen } from 'expo-router'; // Import the SplashScreen component from expo-router
import SplashScreen1 from './Authentication/Splash1';

const index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading process, e.g., fetching data or resources
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide the splash screen after 3 seconds
    }, 3000); // Change the duration as needed

    return () => clearTimeout(timer); // Clear timer on unmount
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        {/* Splash Screen Content */}
        <Image source={require('../assets/Images/Splash1.png')} style={styles.splashImage} />
        <Text style={styles.appName}>EcoAlert</Text>
      </View>
    );
  }

  // After loading, navigate to the main application
  return <SplashScreen1 />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  splashImage: {
    width: 200, // Adjust the size as needed
    height: 200,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#32CD32', // Your desired color
    marginTop: 20,
  },
});

export default index;
