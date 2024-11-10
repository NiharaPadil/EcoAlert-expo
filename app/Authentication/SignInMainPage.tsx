import React , {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions ,Alert} from 'react-native';
import { Button } from 'react-native-elements';
import { useRouter } from 'expo-router';
import { auth, db } from '../../constants/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get('window');

const SignInMainPage = () => {
  const router = useRouter(); // Using expo-router for navigation
  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

  const RegisterPage = () => {
    router.push('/Authentication/RegisterPage'); // Navigate to RegisterPage
  };

  const handleLogin = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      
      const user = userCred.user;

      console.log(user)
      // Retrieve user data from Firestore using uid
      const userDoc = await getDoc(doc(db, 'UserData', user.uid));
      const AuthDoc = await getDoc(doc(db, 'AuthorityData', user.uid));
      
      // if (userDoc.exists())
      //   console.log("exists");
      // else console.log("not exists");
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData && userData.Role) {
          await AsyncStorage.setItem('isLoggedIn', 'true');
          await AsyncStorage.setItem('UserRole', userData.Role);
          await AsyncStorage.setItem('UserId', user.uid);
          navigateToRoleBasedScreen(userData.Role);
        } else {
          setError('User role not found.');
        }
      } 
      else if(AuthDoc.exists())
        {
          const Authdata = AuthDoc.data();
          if (Authdata && Authdata.Role) {
            await AsyncStorage.setItem('isLoggedIn', 'true');
            await AsyncStorage.setItem('UserRole', Authdata.Role);
            await AsyncStorage.setItem('UserId', user.uid);
            navigateToRoleBasedScreen(Authdata.Role);
        }
        else{
          setError('User role not found.');
        }
      }else {
        setError('User data not found in Firestore.');
      }
    } catch (err) {
      Alert.alert('Uh-oh!', 'Invalid email or password.\n\nPlease try again.');
    }
  };

  const navigateToRoleBasedScreen = (Role: string) => {
    if (Role === 'Authority') {
      router.push('../../Authority/Screen1');
    } else {
      router.push('../../User/Screen1');
    }
  };

  return (
    <View style={styles.container}>
      {/* Image at the top */}
      <Image source={require('../../assets/Images/Pic1.png')} style={styles.topImage} />

      {/* App Name */}
      <Text style={styles.appTitle}>EcoAlert</Text>

      {/* Email Input */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor="#a9a9a9"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#a9a9a9"
      />

      {/* Forgot Password */}
      <View style={{ width: '100%' }}>
        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>

      {/* Sign In Button */}
      <TouchableOpacity onPress={handleLogin} style={styles.signInButton}>
        <Text style={styles.signInTitle}>Login</Text>
      </TouchableOpacity>
      

      {/* Or continue with */}
      <Text style={styles.orText}>Or</Text>

      {/* Google Sign In Button */}
      <TouchableOpacity style={styles.googleButton}>
        <Image
          source={require('../../assets/Images/google_icon.png')} // Replace with the path to your Google icon
          style={styles.icon}
        />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <View style={styles.signUpView}>
        <Text style={styles.signUpText}>Don't have an account? </Text>
        <TouchableOpacity onPress={RegisterPage}>
          <Text style={styles.signUpLink}>Sign Up</Text>
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
    paddingHorizontal: 20,
    paddingTop: 80,
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
    width: '100%',
    height: 50,
    borderColor: '#32CD32',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
  },
  forgotText: {
    alignSelf: 'flex-end',
    color: '#32CD32',
    fontSize: 14,
    marginVertical: 10,
  },
  signInButton: {
    width: '100%',
    backgroundColor: '#32CD32',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  googleButton: {
    width: '100%',
    maxWidth: 350, // Adjust width as needed
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    flexDirection: 'row', // Aligns icon and text horizontally
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center', // Centers content horizontally
    paddingHorizontal: 10,
  },
  icon: {
    width: 24, // Adjust the size of the icon as needed
    height: 24,
    marginRight: 10, // Space between icon and text
  },
  googleButtonText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  signInTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },
  orText: {
    fontSize: 14,
    color: '#000',
    marginVertical: 10,
  },
  signUpView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  signUpText: {
    fontSize: 14,
    color: '#000',
  },
  signUpLink: {
    fontSize: 14,
    color: '#32CD32',
    fontWeight: 'bold',
  },
});

export default SignInMainPage;
