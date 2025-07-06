// components/CustomDrawer.tsx
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { background } from '../utils/constants';
import { useUser } from '../context/UserContext';
import auth from '@react-native-firebase/auth';

const CustomDrawer = props => {
  const { user, setUser } = useUser();

  const handleLogout = async () => {
    try {
      await auth().signOut();
      setUser(null); // Clear user from context
      props.navigation.replace('Login'); // Redirect to login
    } catch (err) {
      console.log('Logout error:', err);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.profileSection}>
        <Image
          source={require('../assets/logo.png')} // 👈 replace with your image
          style={styles.profileImage}
        />
        {user ? (
          <Text style={styles.userName}>{user.name}</Text>
        ) : (
          <Text style={styles.userName}>Hey There,</Text>
        )}
      </View>
      <DrawerItemList {...props} />
      <View style={styles.footer}>
        {user ? (
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.action}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => props.navigation.replace('Login')}>
            <Text style={styles.action}>Login</Text>
          </TouchableOpacity>
        )}
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: background,
    marginBottom: 20,
  },
  profileImage: {
    width: '100%',
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 16,
  },
  action: {
    fontSize: 16,
    color: '#d00',
    marginTop: 20,
  },
});
