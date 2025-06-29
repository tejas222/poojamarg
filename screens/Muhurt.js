import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { background, primary } from '../utils/constants';

const Muhurt = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>शुभकार्यासाठी पंचांगानुसार मुहूर्त पहा</Text>
      <TextInput
        style={styles.input}
        placeholder="कोणत्या कार्यासाठी मुहूर्त पाहायचा आहे ?"
      />
      <TextInput
        style={styles.input}
        placeholder="कोणत्या महिन्यामध्ये पाहायचा आहे?"
      />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>मुहूर्त पहा</Text>
      </TouchableOpacity>
      <Image source={require('../assets/asset3.png')} style={styles.image} />
    </View>
  );
};

export default Muhurt;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
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
    fontWeight: 'bold',
  },
  image: {
    width: '80%',
    resizeMode: 'contain',
    margin: 'auto',
  },
});
