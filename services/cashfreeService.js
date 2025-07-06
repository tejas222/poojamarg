// import functions from '@react-native-firebase/functions';
// import { CFPaymentGatewayService } from 'react-native-cashfree-pg-sdk';
// import {
//   CFDropCheckoutPayment,
//   CFEnvironment,
//   CFSession,
//   CFThemeBuilder,
// } from 'cashfree-pg-api-contract';
// import auth from '@react-native-firebase/auth';

// // ✅ Creates order and returns { orderId, paymentSessionId }
// export const createOrder = async ({
//   orderId,
//   orderAmount,
//   customerName,
//   customerEmail,
//   customerPhone,
// }) => {
//   const user = auth().currentUser;
//   console.log('usercheck', user?.uid);

//   if (!user) {
//     console.error('Error: User not authenticated when calling createOrder');
//     throw new Error(
//       'User not authenticated. Please log in to proceed with payment.',
//     );
//   }

//   const response = await functions().httpsCallable('createCashfreeOrder')({
//     amount: orderAmount,
//     orderId,
//     customerDetails: {
//       customerId: user.uid,
//       customerName,
//       customerEmail,
//       customerPhone,
//     },
//     // You can optionally pass the token here if your function needs it explicitly
//     // Although `onCall` handles it via context, this is for demonstration
//     // firebaseIdToken: idToken,
//   });

//   const { orderId: id, paymentSessionId } = response.data;

//   return { orderId: id, orderToken: paymentSessionId };
// };
// // ✅ Launches Drop Checkout
// export const startCashfreePayment = async ({ orderId, orderToken }) => {
//   const session = new CFSession(orderToken, orderId, CFEnvironment.SANDBOX);

//   const theme = new CFThemeBuilder()
//     .setNavigationBarBackgroundColor('#E64A19')
//     .setNavigationBarTextColor('#FFFFFF')
//     .setButtonBackgroundColor('#FFC107')
//     .setButtonTextColor('#FFFFFF')
//     .setPrimaryTextColor('#212121')
//     .setSecondaryTextColor('#757575')
//     .build();

//   const dropPayment = new CFDropCheckoutPayment(session, null, theme);

//   return CFPaymentGatewayService.doPayment(dropPayment);
// };
