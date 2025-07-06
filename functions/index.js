const functions = require('firebase-functions');
const axios = require('axios');
const admin = require('firebase-admin');
require('dotenv').config();

admin.initializeApp();
const firestore = admin.firestore();

const {
  CASHFREE_APP_ID,
  CASHFREE_SECRET_KEY,
  CASHFREE_BASE_URL,
  CASHFREE_API_VERSION,
} = process.env;

// 🔄 Cashfree Order Creation Function
exports.createCashfreeOrder = functions.https.onCall(async (data, context) => {
  const {
    orderId,
    orderAmount,
    customerName,
    customerEmail,
    customerPhone,
    customerId,
  } = data.data;

  console.log('Creating Cashfree orderId:', orderId);

  if (
    !orderId ||
    !orderAmount ||
    !customerName ||
    !customerEmail ||
    !customerPhone
  ) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required order or customer details',
    );
  }

  try {
    const payload = {
      order_id: orderId,
      order_amount: Number(orderAmount),
      order_currency: 'INR',
      customer_details: {
        customer_id: customerId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: `https://poojamarg.com/payment-return?order_id=${orderId}`,
        notify_url: `https://${process.env.GCLOUD_REGION || 'us-central1'}-${
          process.env.GCP_PROJECT_ID
        }.cloudfunctions.net/cashfreeWebhook`,
      },
      order_note: 'POOJAMARG Order',
    };

    const response = await axios.post(`${CASHFREE_BASE_URL}`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'x-api-version': CASHFREE_API_VERSION,
      },
    });

    return {
      success: true,
      payment_session_id: response.data.payment_session_id,
      order_id: response.data.order_id,
    };
  } catch (error) {
    console.error(
      'Cashfree order creation failed:',
      error.response?.data || error.message,
    );
    throw new functions.https.HttpsError(
      'internal',
      'Cashfree order failed',
      error.response?.data || error.message,
    );
  }
});

// ✅ Cashfree Webhook Handler
exports.cashfreeWebhook = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    const eventData = req.body;
    console.log('Cashfree Webhook Received:', JSON.stringify(eventData));

    const { event, data } = eventData;
    if (event === 'PAYMENT_SUCCESS') {
      const { order_id, payment_id, payment_status } = data;

      // 🔄 Update booking with this order ID if found
      const matchingBookings = await firestore
        .collection('poojaBookings')
        .where('orderId', '==', order_id)
        .limit(1)
        .get();

      if (!matchingBookings.empty) {
        const bookingDoc = matchingBookings.docs[0];
        await bookingDoc.ref.update({
          paymentId: payment_id,
          paymentStatus: payment_status,
          paymentVerifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`Updated booking for order_id: ${order_id}`);
      } else {
        console.warn(`No matching booking found for order_id: ${order_id}`);
      }
    }

    res.status(200).send('Webhook handled');
  } catch (err) {
    console.error('Error in Cashfree webhook:', err);
    res.status(500).send('Internal Server Error');
  }
});
