import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { background, primary } from '../utils/constants';
import { useUser } from '../context/UserContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Dashboard = () => {
  const { user } = useUser();

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {user.role == 'admin' && (
        <>
          <TouchableOpacity
            onPress={() => navigation.navigate('addCategory')}
            style={styles.button}
          >
            <MaterialCommunityIcons
              name="playlist-plus"
              color={primary}
              size={35}
            />
            <Text style={styles.text}>Add Category</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('AddPooja')}
            style={styles.button}
          >
            <MaterialCommunityIcons name="flower" color={primary} size={35} />
            <Text style={styles.text}>Add Pooja</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('AllBookings')}
            style={styles.button}
          >
            <MaterialCommunityIcons
              name="clipboard-list"
              color={primary}
              size={35}
            />
            <Text style={styles.text}>Bookings</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 25,
    paddingHorizontal: 15,
    flex: 1,
    backgroundColor: background,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  button: {
    paddingVertical: 25,
    backgroundColor: 'white',
    textAlign: 'center',
    elevation: 4,
    alignItems: 'center',
    width: '47%',
  },
  text: {
    color: primary,
    fontWeight: '500',
    fontSize: 22,
  },
});
