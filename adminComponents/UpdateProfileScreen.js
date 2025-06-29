import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { background, primary } from '../utils/constants';
import firestore from '@react-native-firebase/firestore';
import DatePicker from 'react-native-date-picker';
import { useUser } from '../context/UserContext';

const UpdateProfileScreen = ({ navigation }) => {
  const { user, setUser } = useUser();
  const { uid, phoneNumber, name, dob, gender } = user;

  const [updatedName, setUpdatedName] = useState(name || '');
  const [selectedGender, setSelectedGender] = useState(gender || '');
  const [date, setDate] = useState(dob ? parseDate(dob) : new Date());
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function parseDate(dobStr) {
    const [day, month, year] = dobStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  const saveDetails = async () => {
    if (!updatedName.trim()) {
      Alert.alert('Validation Error', 'Please enter your name.');
      return;
    }

    setLoading(true);

    try {
      const formattedDOB = `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`;

      await firestore().collection('users').doc(uid).update({
        name: updatedName,
        dob: formattedDOB,
        gender: selectedGender,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      // Update user context
      setUser(prev => ({
        ...prev,
        name: updatedName,
        dob: formattedDOB,
        gender: selectedGender,
      }));

      Alert.alert('Success', 'Profile updated successfully');
      navigation.replace('Drawer');
    } catch (error) {
      console.log('Error saving user:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Your Details</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={updatedName}
        onChangeText={setUpdatedName}
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

      <Text style={styles.label}>Gender</Text>
      <View style={styles.genderRow}>
        {['Male', 'Female', 'Other'].map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.genderOption,
              selectedGender === option && styles.genderSelected,
            ]}
            onPress={() => setSelectedGender(option)}
          >
            <Text
              style={{
                color: selectedGender === option ? '#fff' : '#333',
              }}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={[styles.input, { color: '#888' }]}
        editable={false}
        value={phoneNumber}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={saveDetails}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Update</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default UpdateProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
    padding: 20,
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
  genderRow: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    backgroundColor: '#eee',
    borderRadius: 8,
    alignItems: 'center',
  },
  genderSelected: {
    backgroundColor: primary,
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
