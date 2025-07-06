// cashfreeservice.js
import { CFPaymentGatewayService } from 'react-native-cashfree-pg-sdk';
import {
  CFDropCheckoutPayment,
  CFEnvironment,
  CFSession,
  CFThemeBuilder,
} from 'cashfree-pg-api-contract';

export const initiateCashfreePayment = async (
  paymentSessionId,
  orderId,
  onVerify, // The contextual onVerify callback from CheckoutButton
  onError, // The contextual onError callback from CheckoutButton
) => {
  try {
    // IMPORTANT: Set the callback just before initiating the payment.
    // This ensures the correct, current handlers are active for this specific payment.
    CFPaymentGatewayService.setCallback({
      onVerify: async verifiedOrderId => {
        console.log(
          'Cashfree SDK: Verified Payment for Order:',
          verifiedOrderId,
        );
        await onVerify(verifiedOrderId); // Execute the passed contextual onVerify
      },
      onError: (error, orderID) => {
        console.log('Cashfree SDK: Payment Error', error, orderID);
        onError(error, orderID); // Execute the passed contextual onError
      },
    });

    const session = new CFSession(
      paymentSessionId,
      orderId,
      CFEnvironment.SANDBOX, // Make sure this matches your environment (SANDBOX or PRODUCTION)
    );

    const theme = new CFThemeBuilder()
      .setNavigationBarBackgroundColor('#E64A19')
      .setNavigationBarTextColor('#FFFFFF')
      .setButtonBackgroundColor('#FFC107')
      .setButtonTextColor('#FFFFFF')
      .setPrimaryTextColor('#212121')
      .setSecondaryTextColor('#757575')
      .build();

    const dropPayment = new CFDropCheckoutPayment(session, null, theme);

    console.log(
      'Cashfree SDK: Calling doPayment with session:',
      session.orderId,
    );
    CFPaymentGatewayService.doPayment(dropPayment);
  } catch (error) {
    console.error('Cashfree SDK initiation error (before doPayment):', error);
    // If an error occurs even before doPayment, call the onError callback
    // (e.g., if CFSession or CFDropCheckoutPayment construction fails)
    onError(error, orderId);
  }
};
