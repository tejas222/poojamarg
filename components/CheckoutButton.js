// CheckoutButton.js
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { primary } from '../utils/constants'; // Assuming this path is correct
// Removed 'createOrder' as it's not used directly here
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import functions from '@react-native-firebase/functions';
import firestore from '@react-native-firebase/firestore';
import { initiateCashfreePayment } from '../utils/cashfreeService'; // Make sure this path is correct

const CheckoutButton = ({ updatedDetails, onPaymentSuccess }) => {
  const navigation = useNavigation();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  // Destructure with default values to prevent errors if props are missing
  const {
    user = {}, // Provide a default empty object for user
    muhurtPrice,
    name,
    pooja = {}, // Provide a default empty object for pooja
    phone,
    email,
  } = updatedDetails || {}; // Provide a default empty object for updatedDetails

  // Ref to prevent duplicate handling of a single successful payment callback
  const hasProcessedPaymentSuccess = useRef(false);

  useEffect(() => {
    // This useEffect is now solely for tracking user authentication status.
    // The Cashfree callback initialization has been moved into handlePayment.
    const unsubscribe = auth().onAuthStateChanged(u => {
      setUserDetails(u);
      setLoading(false);
    });

    return unsubscribe;
  }, []); // No dependencies, runs once on mount

  const handlePayment = async () => {
    const currentUser = auth().currentUser;

    if (!currentUser) {
      Alert.alert('Not logged in', 'Please sign in first');
      return;
    }

    if (isProcessingPayment) {
      console.log('Payment already in progress, ignoring tap.');
      return; // Prevent multiple taps
    }

    setIsProcessingPayment(true);
    hasProcessedPaymentSuccess.current = false; // Reset flag for a new payment attempt

    try {
      const orderId = `ORDER_${Date.now()}`; // Ensure unique orderId

      console.log(
        'CheckoutButton: Calling createCashfreeOrder Cloud Function...',
      );
      const res = await functions().httpsCallable('createCashfreeOrder')({
        orderId,
        orderAmount: muhurtPrice ? muhurtPrice : pooja.price,
        customerId: currentUser.uid,
        customerName: name ? name : user.name,
        customerEmail: email ? email : 'test@test.com', // Provide a fallback if user.email is not set
        customerPhone: phone ? phone : user.phoneNumber,
      });

      const { payment_session_id, order_id } = res.data;

      if (!payment_session_id || !order_id) {
        throw new Error(
          'Failed to get valid payment session ID or order ID from backend.',
        );
      }

      // Define the onVerify and onError handlers specific to THIS payment attempt.
      const onVerify = async verifiedOrderId => {
        console.log(
          'CheckoutButton: Payment Verified successfully by SDK callback.',
        );

        // --- Workaround for duplicate SDK callbacks ---
        if (hasProcessedPaymentSuccess.current) {
          console.log(
            'CheckoutButton: Skipping duplicate success callback for order:',
            verifiedOrderId,
          );
          return; // Already processed, prevent re-execution
        }
        hasProcessedPaymentSuccess.current = true; // Mark as processed for this payment
        // --- End of Workaround ---

        Alert.alert('Booking Successful!!!!');
        onPaymentSuccess?.(); // This triggers the specific success logic in the parent screen
        setIsProcessingPayment(false); // Reset processing state after successful completion
      };

      const onError = (error, orderID) => {
        console.log('CheckoutButton: Payment Error', error, orderID);
        Alert.alert(
          'Payment Failed',
          error.message || 'An unknown error occurred during payment.',
        );
        setIsProcessingPayment(false); // Reset processing state on error
        hasProcessedPaymentSuccess.current = false; // Allow retries after an error
      };

      console.log('CheckoutButton: Initiating Cashfree payment...');
      await initiateCashfreePayment(
        payment_session_id,
        order_id,
        onVerify,
        onError,
      );
    } catch (e) {
      console.error('CheckoutButton: Cashfree payment process failed:', e);
      Alert.alert('Error', e.message || 'Payment could not be initiated.');
      setIsProcessingPayment(false); // Reset processing state if initiation fails
      hasProcessedPaymentSuccess.current = false; // Allow retries after an initiation error
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePayment}
        disabled={isProcessingPayment || loading} // Disable button while loading user or processing
      >
        <Text style={styles.buttonText}>
          {loading
            ? 'Loading...'
            : isProcessingPayment
            ? 'Processing Payment...'
            : 'Pay Now'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CheckoutButton;

const styles = StyleSheet.create({
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
