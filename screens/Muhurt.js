import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { background, primary } from '../utils/constants';
import CheckoutButton from '../components/CheckoutButton';
import { useUser } from '../context/UserContext';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const Muhurt = () => {
  const { user, poojaPrice } = useUser();
  const { muhurtPrice } = poojaPrice;
  const navigation = useNavigation();

  const [muhurtName, setMuhurtName] = useState('');
  const [poojaMonth, setPoojaMonth] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  // const isFormValid = muhurtName.trim() !== '' && poojaMonth.trim() !== '';
  const updatedDetails = { user, muhurtPrice };
  const muhurtNameRef = useRef('');
  const poojaMonthRef = useRef('');
  useEffect(() => {
    muhurtNameRef.current = muhurtName;
  }, [muhurtName]);

  useEffect(() => {
    poojaMonthRef.current = poojaMonth;
  }, [poojaMonth]);

  const handlePaymentSuccess = async () => {
    console.log('🔥 Muhurt Request handlePaymentSuccess CALLED! 🔥'); // Add this
    setPaymentSuccess(true);

    try {
      const requestId = `MUHURT_${Date.now()}`;
      const bookingData = {
        requestId: requestId,
        muhurtName: muhurtNameRef.current,
        month: poojaMonthRef.current,
        muhurtPrice: muhurtPrice,
        customerName: user.name,
        customerPhone: user.phoneNumber,
        userId: auth().currentUser?.uid,
        paymentStatus: 'Paid',
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore().collection('muhurtRequests').add(bookingData);
      navigation.navigate('MyBookings');

      setMuhurtName('');
      setPoojaMonth('');
    } catch (error) {
      console.log('Error saving booking', error);
      Alert.alert('Error', 'Could not save booking. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>शुभकार्यासाठी पंचांगानुसार मुहूर्त पहा</Text>

      <TextInput
        style={styles.input}
        placeholder="कोणत्या कार्यासाठी मुहूर्त पाहायचा आहे ?"
        value={muhurtName}
        onChangeText={setMuhurtName}
      />

      <TextInput
        style={styles.input}
        placeholder="कोणत्या महिन्यामध्ये पाहायचा आहे?"
        value={poojaMonth}
        onChangeText={setPoojaMonth}
      />

      {/* Show CheckoutButton only when both fields are filled */}
      <CheckoutButton
        updatedDetails={updatedDetails}
        onPaymentSuccess={handlePaymentSuccess}
      />
      <Image source={require('../assets/asset3.png')} style={styles.image} />
    </View>
  );
};

export default Muhurt;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
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
    fontWeight: 'bold',
  },
  image: {
    width: '80%',
    resizeMode: 'contain',
    margin: 'auto',
  },
});
