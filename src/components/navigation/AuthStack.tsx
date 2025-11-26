// src/components/navigation/AuthStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../../screens/LoginScreen';
import SignupScreen from '../../screens/SignUpScreen';


export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

interface AuthStackProps {
  onLoginSuccess: () => void;
  onSignupSuccess: () => void;
}

export function AuthStack({ onLoginSuccess, onSignupSuccess }: AuthStackProps) {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreen
            {...props}
            onLogin={onLoginSuccess}
            onDemoLogin={onLoginSuccess}
            onSwitchToSignup={() => props.navigation.navigate('Signup')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Signup">
        {(props) => (
          <SignupScreen
            {...props}
            onSignupSuccess={onSignupSuccess}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
