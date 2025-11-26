// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import { SignupScreen } from './src/screens/SignUpScreen';
import { PasswordRecoveryScreen } from './src/screens/PasswordRecoveryScreen';

import { RootStackParamList } from './src/components/navigation/types';
import MainTabs from './src/components/navigation/mainTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen name="Signup">
          {() => (
            <SignupScreen
              onSignup={(data) => {
                console.log('Signed up:', data);
              }}
              onSwitchToLogin={() => {
                console.log('Switch to login');
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="PasswordRecovery">
          {() => (
            <PasswordRecoveryScreen
              onGoBack={() => {
                console.log('PasswordRecovery: go back');
              }}
              onRecoveryLinkSent={() => {
                console.log('Recovery link sent');
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
