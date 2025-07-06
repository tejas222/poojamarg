import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { background, primary } from '../utils/constants';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';

const UserDetailsUpdate = ({ route }) => {
  const { user } = useUser();
  const navigation = useNavigation();
  const { checkoutData } = route.params;
  const [address, setAddress] = useState('');
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phoneNumber);
  const [email, setEmail] = useState('');

  const updatedDetails = { ...checkoutData, name, phone, address, email };
  console.log('checkoutData', checkoutData);
  const handleSubmit = () => {
    if (!address && !email) {
      Alert.alert('Please fill all fields');
      return;
    }
    navigation.navigate('Checkout', { updatedDetails });
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>UserDetailsUpdate</Text>

      <TextInput value={user.name} style={styles.input} editable={false} />
      <TextInput
        value={user.phoneNumber}
        style={styles.input}
        editable={false}
      />
      <TextInput
        placeholder="Enter Email Address"
        value={email}
        style={styles.input}
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.inputDesc}
        placeholder="Enter Complete Address"
        value={address}
        multiline={true}
        numberOfLines={4}
        textAlignVertical="top"
        onChangeText={setAddress}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Continue to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserDetailsUpdate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
    padding: 20,
  },
  heading: {
    fontSize: 28,
    textAlign: 'center',
    marginVertical: 10,
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
  inputDesc: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    height: 150,
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
