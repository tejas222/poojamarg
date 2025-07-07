import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { background } from '../utils/constants';

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 25 }}>Comming Soon</Text>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
