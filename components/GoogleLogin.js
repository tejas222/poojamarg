import { StyleSheet, Text, View, Button, Platform, Alert } from 'react-native';
import React from 'react';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin'; // Import statusCodes
import auth from '@react-native-firebase/auth';
import { useAuth } from '../context/AuthContext';

const GoogleLogin = () => {
  // You're destructuring these, but not using them directly in this component.
  // This is okay if they're just for context.
  const { user, idToken, logout } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      if (Platform.OS === 'android') {
        // Optional: add small delay if needed for Android activity lifecycle issues
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const { idToken: googleIdToken } = await GoogleSignin.signIn();
      const googleCredential =
        auth.GoogleAuthProvider.credential(googleIdToken);
      await auth().signInWithCredential(googleCredential);

      // No explicit success handling here. The user state change will be handled by AuthContext.
      // You might want to add some visual feedback (e.g., loading spinner) here.
    } catch (error) {
      console.error('Google login error:', error); // Log the full error object for debugging

      let errorMessage = 'An unknown error occurred during Google Sign In.';
      let errorCode = null;

      // Safely access error.code if error object exists and has a code property
      if (error && typeof error === 'object' && 'code' in error) {
        errorCode = error.code;
      }

      // Use the statusCodes from @react-native-google-signin/google-signin
      // for more precise error messages.
      switch (errorCode) {
        case statusCodes.SIGN_IN_CANCELLED:
          errorMessage = 'You cancelled the Google Sign In process.';
          break;
        case statusCodes.IN_PROGRESS:
          errorMessage = 'Google Sign In is already in progress. Please wait.';
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          errorMessage =
            'Google Play Services are not available or outdated on your device.';
          break;
        case statusCodes.DEVELOPER_ERROR: // This is the error you were getting previously!
          errorMessage =
            'Developer Error: Configuration issue. Please check SHA-1 fingerprint and package name in Firebase.';
          break;
        // Firebase specific error codes (auth().signInWithCredential errors)
        case 'auth/credential-already-in-use':
          errorMessage =
            'This Google account is already linked to another user.';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage =
            'An account already exists with the same email address but different sign-in credentials.';
          break;
        default:
          // Fallback to error.message if it exists, otherwise generic message
          errorMessage = error?.message || errorMessage;
          break;
      }

      Alert.alert('Sign In Error', errorMessage);
    }
  };

  return (
    <View>
      <Button title="Sign in with Google" onPress={handleGoogleLogin} />
      {/* Optional: Add a loading indicator here if the sign-in process takes time */}
    </View>
  );
};

export default GoogleLogin;

const styles = StyleSheet.create({});
