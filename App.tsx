// App.tsx
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  Home,
  BarChart2,
  MessageCircle,
  User,
  Trophy,
} from 'lucide-react-native';

import { BRAND_COLORS as COLORS } from './src/styles/Colors';

import StatsScreen from './src/screens/stats/StatsScreen';
;
import MessagesStackNavigator from './src/components/navigation/MessagesStack';



// Auth
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignUpScreen';

// Mocks
import { MOCK_USERS, MOCK_PROFILES } from './src/data/TestUserData';

// Types
import { RootTabParamList } from './src/components/navigation/types';
import RankingsScreen from './src/screens/rankings/RankingScreen';
import ProfileStackNavigator from './src/components/navigation/ProfileStack';
import HomeStackNavigator from './src/components/navigation/HomeStack';
import StatsStackNavigator from './src/components/navigation/StatsStack';

// ------------------------
// Auth Stack
// ------------------------
type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

// Para pasar user al ProfileScreen
type ProfileWithExtra = {
  fullName: string;
  email: string;
  createdAt: Date;
  avatarURL?: string | null;
};

// ------------------------
// App Tabs (CON TU NAVBAR)
// ------------------------
function AppTabs({
  currentProfile,
  onLogout,
}: {
  currentProfile?: ProfileWithExtra;
  onLogout: () => void;
}) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: COLORS.TEXT_MUTED,
        tabBarStyle: {
          backgroundColor: COLORS.BACKGROUND_DEFAULT,
          borderTopColor: COLORS.BORDER_COLOR,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Rankings"
        component={RankingsScreen}
        options={{
          title: 'Rankings',
          tabBarIcon: ({ color, size }) => (
            <Trophy size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Stats"
        component={StatsStackNavigator}
        options={{
          title: 'Stats',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <BarChart2 color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
        }}
      >
        {() => (
          <ProfileStackNavigator
            currentProfile={currentProfile}
            onLogout={onLogout}
          />
        )}
      </Tab.Screen>

    </Tab.Navigator>
  );
}

// ------------------------
// Root Navigator
// ------------------------
function RootNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<ProfileWithExtra>();

  const loginUser = () => {
    const user = MOCK_USERS[0];
    const profile = MOCK_PROFILES.find((p) => p.userId === user.id);

    setCurrentProfile({
      fullName: profile?.fullName ?? user.username,
      email: user.email,
      createdAt: user.createdAt,
      avatarURL: profile?.avatarURL ?? null,
    });

    setIsAuthenticated(true);
  };

  const handleDemoLogin = () => loginUser();
  const handleSignup = () => loginUser();

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentProfile(undefined);
  };

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AppTabs currentProfile={currentProfile} onLogout={handleLogout} />
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login">
            {(props) => (
              <LoginScreen
                {...props}
                onLogin={loginUser}
                onDemoLogin={handleDemoLogin}
                onSwitchToSignup={() =>
                  props.navigation.navigate('Signup')
                }
              />
            )}
          </AuthStack.Screen>

          <AuthStack.Screen name="Signup">
            {(props) => (
              <SignupScreen
                {...props}
                onSignupSuccess={handleSignup}
              />
            )}
          </AuthStack.Screen>
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}

// ------------------------
// APP ROOT
// ------------------------
export default function App() {
  return <RootNavigator />;
}
