// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './navigation/DrawerNavigator';
import RootNavigator from './navigation/RootNavigator';
import { UserProvider } from './context/UserContext';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AuthProvider } from './context/AuthContext';
import BootSplash from 'react-native-bootsplash';

export default function App() {
  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await BootSplash.hide({ fade: true });
      console.log('BootSplash has been hidden successfully');
    });
  }, []);
  return (
    <AuthProvider>
      <UserProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </UserProvider>
    </AuthProvider>
  );
}
