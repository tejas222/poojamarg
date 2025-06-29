import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { background, primary } from '../utils/constants';

const Dashboard = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('addCategory')}
        style={styles.button}
      >
        <Text style={styles.text}>Add Category</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('AddPooja')}
        style={styles.button}
      >
        <Text style={styles.text}>Add Pooja</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('addCategory')}
        style={styles.button}
      >
        <Text style={styles.text}>Bookings</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
    backgroundColor: background,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  button: {
    padding: 20,
    backgroundColor: primary,
    textAlign: 'center',
    elevation: 4,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});
