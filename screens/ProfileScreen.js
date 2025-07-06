import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { background, primary } from '../utils/constants';
import firestore from '@react-native-firebase/firestore';
import DatePicker from 'react-native-date-picker';

const ProfileScreen = ({ route, navigation }) => {
  const { uid, phoneNumber } = route.params;
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const saveDetails = async () => {
    // Basic validation to ensure name is not empty
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter your name.');
      return;
    }

    try {
      const formattedDOB = `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`;

      // Use .set() to create the new user document
      await firestore().collection('users').doc(uid).set({
        uid: uid, // Good practice to store the uid in the document too
        name,
        dob: formattedDOB,
        phoneNumber,
        createdAt: firestore.FieldValue.serverTimestamp(), // Add the timestamp here
      });

      Alert.alert('Success', 'Profile saved successfully');
      navigation.replace('Drawer');
    } catch (error) {
      console.log('Error saving user:', error);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your Details</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        keyboardType="default"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Birth date</Text>
      <TouchableOpacity onPress={() => setOpen(true)}>
        <TextInput
          style={styles.input}
          placeholder="Select birthdate"
          editable={false}
          pointerEvents="none"
          value={`${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`}
        />
      </TouchableOpacity>

      <DatePicker
        modal
        open={open}
        date={date}
        mode="date"
        onConfirm={selectedDate => {
          setOpen(false);
          setDate(selectedDate);
        }}
        onCancel={() => setOpen(false)}
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput style={styles.input} editable={false} value={phoneNumber} />

      <TouchableOpacity style={styles.button} onPress={saveDetails}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
    padding: 20,
    // justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginVertical: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
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
  },
});
