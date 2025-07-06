import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { background, primary, secondary, success } from '../utils/constants';
import { createOrder, startCashfreePayment } from '../services/cashfreeService';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import functions from '@react-native-firebase/functions';
import {
  CFCallback,
  CFErrorResponse,
  CFPaymentGatewayService,
} from 'react-native-cashfree-pg-sdk';
import {
  CFDropCheckoutPayment,
  CFEnvironment,
  CFSession,
  CFThemeBuilder,
} from 'cashfree-pg-api-contract';
import firestore from '@react-native-firebase/firestore';
import CheckoutButton from '../components/CheckoutButton';

const CheckoutScreen = ({ route }) => {
  const navigation = useNavigation();
  const { updatedDetails } = route.params;
  const { pooja, selectedDate, name, phone, address, email } = updatedDetails;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const updatedDetailsRef = useRef(updatedDetails);

  useEffect(() => {
    updatedDetailsRef.current = updatedDetails;
  }, [updatedDetails]);

  useEffect(() => {
    let hasSavedBooking = false;
    const unsubscribe = auth().onAuthStateChanged(u => {
      setUser(u);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handlePaymentSuccess = async () => {
    setPaymentSuccess(true);
    const currentUpdatedDetails = updatedDetailsRef.current;
    const { pooja, selectedDate, name, phone, address, email } =
      currentUpdatedDetails;
    try {
      const bookingData = {
        poojaId: pooja.id,
        poojaName: pooja.title,
        poojaPrice: pooja.price,
        poojaDate: selectedDate,
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        customerAddress: address,
        categoryId: pooja.categoryId,
        userId: auth().currentUser?.uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore().collection('poojaBookings').add(bookingData);
      navigation.navigate('MyBookings');
    } catch (error) {
      console.log('Error saving booking', error);
      Alert.alert('Error', 'Could not save booking. Please try again.');
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Confirm Your Booking</Text>
      <View style={styles.userDetails}>
        <Text style={styles.label}>
          Name: <Text style={styles.info}>{name}</Text>
        </Text>
        <Text style={styles.label}>
          Phone: <Text style={styles.info}>{phone}</Text>
        </Text>
        <Text style={styles.label}>
          Email: <Text style={styles.info}>{email}</Text>
        </Text>
        <Text style={styles.label}>
          Address: <Text style={styles.info}> {address}</Text>
        </Text>
      </View>

      <View style={styles.poojaDetails}>
        <Text style={styles.label}>
          Pooja Name: <Text style={styles.info}> {pooja.title}</Text>
        </Text>
        <Text style={styles.label}>
          Pooja Date: <Text style={styles.info}> {selectedDate}</Text>
        </Text>
      </View>
      <View style={styles.poojaDetails}>
        <Text style={styles.subHeading}>Included in package</Text>
        <Text style={styles.label}>Dakshina </Text>
        <Text style={styles.label}>Pooja Samagri </Text>
        <Text style={styles.label}>Fruits and Flowers </Text>
      </View>
      <View style={styles.priceDetails}>
        <Text style={styles.subHeading}>Total:</Text>
        <Text style={styles.price}>₹{pooja.price}</Text>
      </View>
      <CheckoutButton
        updatedDetails={updatedDetails}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </View>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
    padding: 20,
  },
  heading: {
    fontSize: 25,
    textAlign: 'center',
    fontWeight: '500',
    color: primary,
    marginBottom: 10,
  },
  userDetails: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    elevation: 2,
  },
  label: {
    fontSize: 18,
    marginVertical: 5,
    fontWeight: '500',
  },
  poojaDetails: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    elevation: 2,
    marginVertical: 10,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: '500',
    color: secondary,
    marginBottom: 10,
  },
  priceDetails: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    elevation: 2,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 20,
    color: success,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 18,
    fontWeight: '400',
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
