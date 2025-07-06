// import React, { useState, useEffect } from 'react';
// import { View, Button, Alert, ActivityIndicator } from 'react-native';
// import auth from '@react-native-firebase/auth';
// import functions from '@react-native-firebase/functions';
// import {
//   CFCallback,
//   CFErrorResponse,
//   CFPaymentGatewayService,
// } from 'react-native-cashfree-pg-sdk';
// import {
//   CFDropCheckoutPayment,
//   CFEnvironment,
//   CFSession,
//   CFThemeBuilder,
// } from 'cashfree-pg-api-contract';

// export default function PaymentScreen() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = auth().onAuthStateChanged(u => {
//       setUser(u);
//       setLoading(false);
//     });

//     CFPaymentGatewayService.setCallback({
//       onVerify: orderID => {
//         Alert.alert('Payment Success', `Order ID: ${orderID}`);
//         // Optional: update Firestore with payment status
//       },
//       onError: (error, orderID) => {
//         console.log('Payment Error', error, orderID);
//         Alert.alert('Payment Failed', error.message);
//       },
//     });

//     return unsubscribe;
//   }, []);

//   const handlePayment = async () => {
//     const currentUser = auth().currentUser;
//     if (!currentUser) {
//       Alert.alert('Not logged in', 'Please sign in first');
//       return;
//     }

//     try {
//       const idToken = await currentUser.getIdToken();
//       console.log('idToken', idToken);
//       const orderId = `ORDER_${Date.now()}`;

//       const res = await functions().httpsCallable('createCashfreeOrder')({
//         orderId: orderId,
//         orderAmount: 100.0,
//         customerName: 'Test User',
//         customerEmail: 'test@example.com',
//         customerPhone: '9876543210',
//       });

//       const { payment_session_id, order_id } = res.data;

//       const session = new CFSession(
//         payment_session_id,
//         order_id,
//         CFEnvironment.SANDBOX,
//       );

//       const theme = new CFThemeBuilder()
//         .setNavigationBarBackgroundColor('#E64A19')
//         .setNavigationBarTextColor('#FFFFFF')
//         .setButtonBackgroundColor('#FFC107')
//         .setButtonTextColor('#FFFFFF')
//         .setPrimaryTextColor('#212121')
//         .setSecondaryTextColor('#757575')
//         .build();

//       const dropPayment = new CFDropCheckoutPayment(session, null, theme);

//       CFPaymentGatewayService.doPayment(dropPayment);
//     } catch (e) {
//       console.error('Cashfree error (catch block):', e);
//       Alert.alert('Error', e.message || 'Payment could not be initiated');
//     }
//   };
//   if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
//       <Button title="Pay ₹100 with Cashfree" onPress={handlePayment} />
//     </View>
//   );
// }
