import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Platform, // Don't forget to import Platform for consistency
} from 'react-native';
// Import specific methods from @react-native-firebase/auth
import {
  getAuth,
  signInWithPhoneNumber,
  onAuthStateChanged,
} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { background, primary } from '../utils/constants';
import { useUser } from '../context/UserContext';
import { useEffect } from 'react'; // Import useEffect for the auth state listener

const Login = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState(null); // Firebase phone auth confirmation object
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();

  // Initialize Firebase Auth instance
  const authInstance = getAuth();

  // Listen for authentication state changes, primarily for auto-verification on Android
  useEffect(() => {
    const subscriber = onAuthStateChanged(authInstance, user => {
      if (user) {
        console.log('Firebase Auth State Changed:', user.uid);
        handleUserLoginSuccess(user); // Centralize success handling
      } else {
        console.log('Firebase Auth State Changed: No user');
      }
    });

    return subscriber; // Unsubscribe on unmount
  }, [authInstance]); // Dependency on authInstance to ensure listener is correctly setup

  // Centralized success handler for user login (OTP or Google)
  const handleUserLoginSuccess = async user => {
    setLoading(true);

    try {
      const userRef = firestore().collection('users').doc(user.uid);
      const userDocument = await userRef.get();

      if (userDocument.exists()) {
        const userData = userDocument.data();
        setUser({ uid: user.uid, ...userData });

        console.log('User exists, navigating to Drawer');
        navigation.replace('Drawer');
      } else {
        // This is a new user
        console.log('New user detected, navigating to Profile');
        setUser({ uid: user.uid, phoneNumber: user.phoneNumber }); // Ensure context is set
        navigation.replace('Profile', {
          uid: user.uid,
          phoneNumber: user.phoneNumber,
        });
      }
    } catch (firestoreError) {
      console.error('Firestore fetch error:', firestoreError);
      Alert.alert(
        'Login Error',
        'Something went wrong while checking your user data. Try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async () => {
    // Basic phone number format validation
    if (!phoneNumber || phoneNumber.length < 10) {
      // Simple length check
      Alert.alert('Error', 'Please enter a valid phone number.');
      return;
    }

    setLoading(true);
    try {
      const updatedPhoneNumber = `+91${phoneNumber}`;
      // Use signInWithPhoneNumber from @react-native-firebase/auth
      const confirmation = await signInWithPhoneNumber(
        authInstance,
        updatedPhoneNumber,
      );
      setConfirm(confirmation);
      Alert.alert('OTP Sent', 'Check your SMS inbox for the 6-digit code.');
    } catch (error) {
      console.error('Error sending OTP:', error);
      let errorMessage = 'Failed to send OTP.';
      if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'The phone number format is invalid.';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const confirmOTP = async () => {
    if (!confirm || !code) {
      Alert.alert('Error', 'Please enter the OTP.');
      return;
    }
    if (code.length !== 6) {
      // Basic OTP length validation
      Alert.alert('Error', 'OTP must be 6 digits long.');
      return;
    }

    setLoading(true);
    try {
      // Use confirm.confirm() on the confirmation object
      const userCredential = await confirm.confirm(code);
      const user = userCredential.user;
    } catch (error) {
      console.error('Error during OTP confirmation:', error);
      let errorMessage = 'Please enter the correct OTP.';
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'The verification code is invalid.';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'The verification code has expired.';
      }
      Alert.alert('Invalid Code', errorMessage);
      setLoading(false); // Make sure to stop loading on error here
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login with Phone</Text>

      {!confirm ? ( // If confirmation object is null, show phone input
        <>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="+91 9876543210"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            editable={!loading} // Disable input when loading
          />
          <TouchableOpacity
            style={styles.button}
            onPress={sendOTP}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        // If confirmation object exists, show OTP input
        <>
          <Text style={styles.label}>Enter OTP</Text>
          <TextInput
            style={styles.input}
            placeholder="6-digit code"
            keyboardType="number-pad"
            maxLength={6}
            value={code}
            onChangeText={setCode}
            editable={!loading} // Disable input when loading
          />
          <TouchableOpacity
            style={styles.button}
            onPress={confirmOTP}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
