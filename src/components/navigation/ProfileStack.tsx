// src/components/navigation/ProfileStack.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from '../../screens/profile/ProfileScreen';
import EditProfileScreen from '../../screens/profile/EditProfileScreen';

// Tipo del stack de perfil
export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

// Mismo shape que usas en AppTabs para el profile actual
type ProfileWithExtra = {
  fullName: string;
  email: string;
  createdAt: Date;
  avatarURL?: string | null;
};

interface ProfileStackProps {
  currentProfile?: ProfileWithExtra;
  onLogout: () => void;
}

export function ProfileStackNavigator({
  currentProfile,
  onLogout,
}: ProfileStackProps) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Pantalla principal de perfil */}
      <Stack.Screen name="ProfileMain">
        {(props) => (
          <ProfileScreen
            {...props}
            user={
              currentProfile ?? {
                fullName: 'Usuario Demo',
                email: 'demo@app.com',
                createdAt: new Date(),
                avatarURL: null,
              }
            }
            stats={{ achievements: 3, longestStreak: 12 }}
            onLogout={onLogout}
            onNavigate={(route) => {
              // Por ahora sólo tenemos EditProfile en este stack
              if (route === 'EditProfile') {
                props.navigation.navigate('EditProfile');
              } else {
                // Más adelante aquí conectas Settings, Reminders, etc.
                console.log('Ruta no implementada aún:', route);
              }
            }}
          />
        )}
      </Stack.Screen>

      {/* Pantalla de edición de perfil */}
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}

export default ProfileStackNavigator;
