// src/components/navigation/RootNavigator.tsx
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthStack } from './AuthStack';
import MainTabs from './mainTabs';


export function RootNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <MainTabs />
      ) : (
        <AuthStack
          onLoginSuccess={() => setIsAuthenticated(true)}
          onSignupSuccess={() => setIsAuthenticated(true)}
        />
      )}
    </NavigationContainer>
  );
}
