import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { background } from '../utils/constants';

const Notifications = () => {
  return (
    <View style={styles.container}>
      <Text>You Don't have any Notifications</Text>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
