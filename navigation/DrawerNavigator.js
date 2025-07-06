// navigation/DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import Notifications from '../screens/Notifications';
import { TouchableOpacity, View } from 'react-native';
import { primary, secondary } from '../utils/constants';
import Login from '../screens/Login';
import CustomDrawer from '../components/CustomDrawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUser } from '../context/UserContext';
import auth from '@react-native-firebase/auth';
import UpdateProfileScreen from '../adminComponents/UpdateProfileScreen';
import Dashboard from '../adminComponents/Dashboard';
import MyBookings from '../screens/MyBookings';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const { user } = useUser();

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerTitle: 'Poojamarg',
        headerTitleAlign: 'center',
        headerTitleStyle: { fontSize: 25, fontWeight: 700, color: secondary },
        headerLeft: () => (
          <View
            style={{ paddingLeft: 16, width: 40, alignItems: 'flex-start' }}
          >
            <TouchableOpacity onPress={navigation.openDrawer}>
              <MaterialCommunityIcons name="menu" color={primary} size={24} />
            </TouchableOpacity>
          </View>
        ),
        headerRight: () => (
          <View style={{ paddingRight: 16, width: 40, alignItems: 'flex-end' }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Notifications')}
            >
              <MaterialCommunityIcons name="bell" color={primary} size={24} />
            </TouchableOpacity>
          </View>
        ),
      })}
    >
      <Drawer.Screen
        name="HomeScreen"
        component={BottomTabNavigator}
        options={{
          drawerLabel: 'Home',
        }}
      />
      {user.role === 'admin' ? (
        <Drawer.Screen name="Dashboard" component={Dashboard} />
      ) : (
        <Drawer.Screen name="My Bookings" component={MyBookings} />
      )}

      {user?.uid && (
        <Drawer.Screen name="MyProfile" options={{ drawerLabel: 'My Profile' }}>
          {props => <UpdateProfileScreen {...props} user={user} />}
        </Drawer.Screen>
      )}
    </Drawer.Navigator>
  );
}
