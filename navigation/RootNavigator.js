import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import Notifications from '../screens/Notifications';
import SinglePoojaScreen from '../screens/SinglePoojaScreen';
import CategoryScreen from '../screens/CategoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Login from '../screens/Login';
import UpdateProfileScreen from '../adminComponents/UpdateProfileScreen';
import CategoryUploadScreen from '../adminComponents/CategoryUploadScreen';
import AddPooja from '../adminComponents/AddPooja';
import CheckoutScreen from '../screens/CheckoutScreen';
import UserDetailsUpdate from '../screens/UserDetailsUpdate';
import { useUser } from '../context/UserContext';

import GoogleLogin from '../components/GoogleLogin';
import SingleBooking from '../screens/SingleBooking';
import BookPooja from '../screens/BookPooja';
import MyBookings from '../screens/MyBookings';
import AllBookings from '../adminComponents/AllBookings';
import EditPooja from '../adminComponents/EditPooja';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { user } = useUser();
  return (
    <Stack.Navigator initialRouteName={user ? 'Drawer' : 'Login'}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      {user && (
        <>
          <Stack.Screen
            name="Drawer"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen name="SinglePooja" component={SinglePoojaScreen} />
          <Stack.Screen name="Category" component={CategoryScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="GoogleLogin" component={GoogleLogin} />
          <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
          <Stack.Screen name="addCategory" component={CategoryUploadScreen} />
          <Stack.Screen name="AddPooja" component={AddPooja} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="UpdateDetails" component={UserDetailsUpdate} />
          <Stack.Screen name="AllBookings" component={AllBookings} />
          <Stack.Screen name="SingleBooking" component={SingleBooking} />
          <Stack.Screen name="BookPooja" component={BookPooja} />
          <Stack.Screen name="MyBookings" component={MyBookings} />
          <Stack.Screen name="EditPooja" component={EditPooja} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({});
