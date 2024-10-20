// app/splashscreen1.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';


const SplashScreen1 = () => {
    const router = useRouter();
    const Splash2 = () => {
        
        router.push('/Authentication/Splash2'); // Navigate to the User Sign Up page
      };

      
    return (
        <View style={styles.slide}>
            <Image
                source={require('../../assets/Images/Splash1.png')} // Replace with your first image file
                style={styles.image}
            />
            <Text style={styles.title}>EcoAlert</Text>
            <TouchableOpacity style={styles.button} onPress={Splash2}>
                <Text style={styles.buttonText}>Next</Text>

            </TouchableOpacity>
            

            {/* Custom Dots */}
            <View style={styles.dotContainer}>
                <View style={[styles.smallDot, styles.activeSmallDot]} />
                <View style={styles.smallDot} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    image: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
        marginVertical: 20,
    },
    button: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#000',
        alignItems: 'center', // Center the button text
    },
    buttonText: {
        fontSize: 18,
        color: '#000',
    },
    dotContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    smallDot: {
        width: 6, // Small dot size
        height: 6,
        borderRadius: 3, // Half of width and height for a circular dot
        backgroundColor: 'rgba(0,0,0,0.2)', // Light grey color for inactive dots
        marginHorizontal: 5,
    },
    activeSmallDot: {
        backgroundColor: '#4CAF50', // Green active dot color
    },
});

export default SplashScreen1;
