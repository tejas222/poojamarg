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

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Drawer"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="SinglePooja" component={SinglePoojaScreen} />
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
      <Stack.Screen name="addCategory" component={CategoryUploadScreen} />
      <Stack.Screen name="AddPooja" component={AddPooja} />
    </Stack.Navigator>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({});
