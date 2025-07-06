import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

GoogleSignin.configure({
  webClientId:
    '733586059146-mmeraoqjngqon1afubqf4ip6min3o6q1.apps.googleusercontent.com', // from Firebase > Project settings > OAuth client
});

export const signInWithGoogle = async () => {
  try {
    // Sign in with Google
    await GoogleSignin.hasPlayServices();
    const { idToken } = await GoogleSignin.signIn();

    // Create Firebase credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign in to Firebase with the credential
    return auth().signInWithCredential(googleCredential);
  } catch (error) {
    console.error(error);
  }
};
