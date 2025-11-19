import React, { useState } from 'react'; 
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen'; 
import { SignupScreen } from './src/screens/SignUpScreen';
import { PasswordRecoveryScreen } from './src/screens/PasswordRecoveryScreen';
import { EditProfileScreen } from './src/screens/EditProfileScreen';
import { MOCK_USER_DATA, MOCK_USER_PROFILE } from './src/data/TestUserData';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { CreateGoalScreen } from './src/screens/CreateGoalScreen';


type AuthState = "login" | "signup" | "authenticated" | "passwordRecovery" | "profileSetup" | "editingProfile" | "creatingGoal"; 

const initialUserData = {
    ...MOCK_USER_PROFILE, // Copia todas las propiedades de Profile
    email: MOCK_USER_DATA.email, // Agrega las propiedades específicas
    createdAt: MOCK_USER_DATA.createdAt, 
};

export default function App() {
  const [authState, setAuthState] = useState<AuthState>("creatingGoal");

  const [currentUser, setCurrentUser] = useState<Profile & { email: string; createdAt: Date; } | null>(initialUserData);

  const handleLogin = (data: { email: string; password: string }) => { 
      console.log(data)
      setAuthState("authenticated"); 
      console.log(setAuthState)
  };

  const handleSignup = (data: { username: string; email: string; password: string; confirmPassword: string }) => { 
      setAuthState("login"); 
      console.log(data)
  };

  const handleLogout = () => {
      setAuthState("login");
      setCurrentUser(null);
  }

  const handleSwitchToSignup = () => {
      setAuthState("signup");
  };

  const handleSwitchToLogin = () => {
      setAuthState("login");
  };

  const handleSwitchToRecovery = () => {
      setAuthState("passwordRecovery");
  }

  const handleSaveProfile = (data: any) => {
    // Logic to save profile and change state
    console.log("Guardando datos:", data);
    setAuthState('authenticated');
  };

  const handleCancelEdit = () => {
    // Logic to discard changes and return
    setAuthState('authenticated');
  };

  const handleCreateGoal = (data: any) => {
    console.log("Creando meta:", data);
    setAuthState('authenticated');
  };

  return (
    <SafeAreaProvider>

      {authState === "login" && <LoginScreen onLogin={handleLogin} onSwitchToSignup={handleSwitchToSignup} onSwitchToRecovery={handleSwitchToRecovery} />} 
      {authState === "signup" && <SignupScreen onSignup={handleSignup} onSwitchToLogin={handleSwitchToLogin} />}
      {authState === "passwordRecovery" && <PasswordRecoveryScreen onGoBack={handleSwitchToLogin} onRecoveryLinkSent={() => setAuthState("login")} />}
      {/* {authState === "authenticated" && currentUser && (
        <ProfileScreen 
          user={currentUser}
          stats={currentUser ? { achievements: 10, longestStreak: 5 } : { achievements: 0, longestStreak: 0 }}
          onLogout={handleLogout}
          onNavigate={(route) => {
            if (route === 'EditProfile') {
              setAuthState('profileSetup');
            }
          }}
        />
      )} */}
      {authState === "profileSetup" && currentUser && (
      <EditProfileScreen/>)}
      {authState === "creatingGoal" && (
      <CreateGoalScreen onGoBack={() => setAuthState('authenticated')} onGoalCreated={handleCreateGoal} />)}
    </SafeAreaProvider>
  );
}