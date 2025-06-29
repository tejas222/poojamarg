import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGE_SENDER_ID,
  FIREBASE_APP_ID,
} from '@env';
import { firebase } from '@react-native-firebase/app';
import '@react-native-firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBFw5E4x7JIoJpAUmHLmchlnPfTtMHWMQM',
  authDomain: 'pojaamarg-otp.firebaseapp.com',
  projectId: 'pojaamarg-otp',
  storageBucket: 'pojaamarg-otp.firebasestorage.app',
  messagingSenderId: '733586059146',
  appId: '1:733586059146:web:2c28ee971d661fe22da273',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
