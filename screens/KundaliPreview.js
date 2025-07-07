import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { background, primary } from '../utils/constants';
import CardItem from '../components/CardItem';
import CheckoutButton from '../components/CheckoutButton';
import { useUser } from '../context/UserContext';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const KundaliPreview = ({ route }) => {
  const navigation = useNavigation();
  const { name, birthDate, birthTime, birthPlace, question, isCustomized } =
    route.params;
  const { user, poojaPrice } = useUser();
  const { kundali, customKundali } = poojaPrice;
  const updatedDetails = {
    user,
    price: isCustomized ? customKundali : kundali,
  };
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Confirm Details',
    });
  }, [navigation]);

  const handlePaymentSuccess = async () => {
    console.log(
      '🔥 Muhurt Request handlePaymentSuccess CALLED! 🔥',
      'price' + kundali,
    ); // Add this
    setPaymentSuccess(true);

    try {
      const requestId = `KUNDALI_${Date.now()}`;
      const bookingData = {
        requestId: requestId,
        name: name,
        birthDate: birthDate,
        birthTime: birthTime,
        birthPlace: birthPlace,
        question,
        customerPhone: user.phoneNumber,
        userId: auth().currentUser?.uid,
        paymentStatus: 'Paid',
        type: isCustomized ? 'Custom Kundali' : 'Simple Kundali',
        price: isCustomized ? customKundali : kundali,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore().collection('kundali').add(bookingData);
      navigation.navigate('MyBookings');
    } catch (error) {
      console.log('Error saving booking', error);
      Alert.alert('Error', 'Could not save booking. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // or 'position'
      style={{ flex: 1 }}
      keyboardVerticalOffset={80} // Adjust if header/nav overlaps
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 50, flexGrow: 1 }}
        >
          <CardItem />

          <Text style={styles.heading}>जन्म तपशील </Text>
          <View style={styles.card}>
            <View style={styles.section}>
              <Text style={styles.label}>
                नाव: <Text style={styles.value}> {name}</Text>
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>
                जन्म तारीख: <Text style={styles.value}> {birthDate}</Text>
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>
                जन्म वेळ:<Text style={styles.value}> {birthTime}</Text>
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>
                जन्मस्थान:<Text style={styles.value}> {birthPlace}</Text>
              </Text>
            </View>
            {isCustomized && (
              <View style={styles.section}>
                <Text style={styles.label}>
                  प्रश्न:<Text style={styles.value}> {question}</Text>
                </Text>
              </View>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              🪔 कुंडलीमध्ये काय समाविष्ट आहे?
            </Text>
            <Text style={styles.cardText}>
              🔯 जन्मकुंडली - ग्रहांची जन्मवेळेची मांडणी
            </Text>
            <Text style={styles.cardText}>
              📍 लग्न - व्यक्तिमत्त्व आणि जीवनशैली
            </Text>
            <Text style={styles.cardText}>
              🌕 चंद्र राशी - भावना व मानसिक स्थैर्य
            </Text>
            <Text style={styles.cardText}>
              ☀️ सूर्य राशी - आत्मविश्वास व उद्दिष्टे
            </Text>
            <Text style={styles.cardText}>
              📅 दशा/अंतर्दशा - जीवनातील कालखंड
            </Text>
            <Text style={styles.cardText}>
              📈 भाव विश्लेषण - विवाह, करिअर, आरोग्य इत्यादी
            </Text>
            <Text style={styles.cardText}>
              🪐 ग्रहबल व दृष्टि - शुभ/अशुभ प्रभाव
            </Text>
            <Text style={styles.cardText}>
              🌌 नक्षत्र व चरण - जन्म नक्षत्र माहिती
            </Text>
            <Text style={styles.cardText}>
              📊 वार्षिक भविष्य - येणाऱ्या वर्षाचे संक्षिप्त विश्लेषण
            </Text>
          </View>
          <View style={{ marginVertical: 15 }}>
            <CheckoutButton
              updatedDetails={updatedDetails}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default KundaliPreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
    padding: 15,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: primary,
    textAlign: 'center',
    marginVertical: 10,
  },
  section: {
    marginBottom: 12,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: '#555',
  },
  value: {
    fontSize: 17,
    color: '#222',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: primary,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 17,
    marginVertical: 2,
    color: '#333',
  },
  note: {
    fontSize: 14,
    color: '#777',
    marginTop: 10,
    fontStyle: 'italic',
  },
});
