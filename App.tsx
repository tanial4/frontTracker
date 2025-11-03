import React, { useState } from 'react'; 
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen'; 
import { SignupScreen } from './src/screens/SignUpScreen';
import { PasswordRecoveryScreen } from './src/screens/PasswordRecoveryScreen';
import { EditProfileScreen } from './src/screens/EditProfileScreen';
import { MOCK_USER_DATA } from './src/data/mockData';
import { ProfileScreen } from './src/screens/ProfileScreen';

type AuthState = "login" | "signup" | "authenticated" | "passwordRecovery" | "profileSetup" | "editingProfile"; 

interface User {
  name: string;
  email: string;
  memberSince: string; 
  // Añade cualquier otra propiedad que uses en tu objeto MOCK_USER_DATA
}

export default function App() {
  const [authState, setAuthState] = useState<AuthState>("authenticated"); 

  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USER_DATA);

  const handleLogin = (data: { email: string; password: string }) => { 
      setAuthState("authenticated"); 
  };

  const handleSignup = (data: { username: string; email: string; password: string; confirmPassword: string }) => { 
      setAuthState("authenticated"); 
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

  return (
    <SafeAreaProvider>

      {authState === "login" && <LoginScreen onLogin={handleLogin} onSwitchToSignup={handleSwitchToSignup} onSwitchToRecovery={handleSwitchToRecovery} />} 
      {authState === "signup" && <SignupScreen onSignup={handleSignup} onSwitchToLogin={handleSwitchToLogin} />}
      {authState === "passwordRecovery" && <PasswordRecoveryScreen onGoBack={handleSwitchToLogin} onRecoveryLinkSent={() => setAuthState("login")} />}
      {authState === "authenticated" && currentUser && (
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
      )}
      {authState === "profileSetup" && currentUser && (
      <EditProfileScreen
        // 1. Pasa la data inicial para que el formulario se pre-rellene (si es necesario)
        initialData={currentUser} 
        
        // 2. Pasa la función para guardar el formulario (onSave)
        onSave={handleSaveProfile} 
        
        // 3. Pasa la función para cancelar y volver (onCancel)
        onCancel={handleCancelEdit} 
        
        // El resto de las props no son necesarias en la llamada principal
    />
)}
    </SafeAreaProvider>
  );
}