import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import {
  accent1,
  accent2,
  background,
  primary,
  secondary,
} from '../utils/constants';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const SingleBooking = ({ route }) => {
  const navigation = useNavigation();
  const { selectedBooking } = route.params;
  const [reply, setReply] = useState('');
  const [uploading, setUploading] = useState(false);

  console.log('updatedDetails', selectedBooking);
  console.log('isReply', selectedBooking.reply);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: selectedBooking.poojaName,
    });
  }, [navigation, selectedBooking.poojaName]);

  const handleSubmit = async docId => {
    if (!reply) {
      Alert.alert('Validation', 'Please enter a reply.');
      return;
    }

    setUploading(true);
    try {
      const updatedDetails = { ...selectedBooking, reply };

      await firestore()
        .collection('muhurtRequests')
        .doc(docId)
        .update(updatedDetails);

      Alert.alert('Success', 'Reply added successfully!');
      navigation.navigate('AllBookings');
      setReply('');
    } catch (error) {
      console.log('Firestore Error:', error);
      Alert.alert('Error', 'Failed to save Reply.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Booking Details</Text>
      <View style={styles.contentWrapper}>
        <Text style={styles.subtitle}>Customer Details</Text>
        <Text style={styles.title}>
          Name: <Text style={styles.text}>{selectedBooking.customerName}</Text>
        </Text>
        <Text style={styles.title}>
          Phone:
          <Text style={styles.text}>{selectedBooking.customerPhone}</Text>
        </Text>
        {selectedBooking.customerEmail && (
          <Text style={styles.title}>
            Email:
            <Text style={styles.text}>{selectedBooking.customerEmail}</Text>
          </Text>
        )}
        {selectedBooking.customerAddress && (
          <Text style={styles.title}>
            Address:
            <Text style={styles.text}>{selectedBooking.customerAddress}</Text>
          </Text>
        )}
      </View>
      <View style={styles.contentWrapper}>
        <Text style={styles.subtitle}>Booking Details</Text>
        {selectedBooking.poojaName ? (
          <>
            <Text style={styles.title}>
              Pooja Name:
              <Text style={styles.text}>{selectedBooking.poojaName}</Text>
            </Text>
            <Text style={styles.title}>
              Pooja Date:
              <Text style={styles.text}>{selectedBooking.poojaDate}</Text>
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.text}>
              <Text style={styles.title}>{selectedBooking.muhurtName} </Text> या
              पूजेसाठी
              <Text style={styles.title}> {selectedBooking.month}</Text> या
              महिन्यातील मुहूर्त पाहायचा आहे.
            </Text>
          </>
        )}
      </View>
      {selectedBooking.muhurtName && (
        <>
          <Text style={styles.heading}>Post reply </Text>
          <TextInput
            style={styles.inputDesc}
            placeholder="Add reply"
            multiline={true}
            numberOfLines={4}
            value={selectedBooking.reply ? selectedBooking.reply : reply}
            textAlignVertical="top"
            onChangeText={setReply}
            editable={!selectedBooking.reply}
          />
          {!selectedBooking.reply && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit(selectedBooking.id)}
              disabled={uploading}
            >
              <Text style={styles.buttonText}>
                {uploading ? 'Sending...' : 'Send'}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default SingleBooking;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
    backgroundColor: background,
  },
  heading: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '500',
    color: primary,
  },
  contentWrapper: {
    backgroundColor: '#fff',
    marginVertical: 15,
    elevation: 4,
    padding: 20,
    gap: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: secondary,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: '400',
  },
  inputDesc: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    height: 150,
    paddingHorizontal: 15,
    marginVertical: 10,
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
  },
});
