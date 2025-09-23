// App.tsx (React Native)
import React, { useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LoginScreen } from "./src/screens/LoginScreen";
import { SignupScreen } from "./src/screens/SignUpScreen";

type AuthState = "login" | "signup" | "authenticated";

interface User {
  name: string;
  email: string;
}

export default function App() {
  const [authState, setAuthState] = useState<AuthState>("login");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (email: string, password: string) => {
    setCurrentUser({
      name: email === "demo@ejemplo.com" ? "Usuario Demo" : email.split("@")[0],
      email,
    });
    setAuthState("authenticated");
  };

  const handleSignup = (name: string, email: string, _password: string) => {
    setCurrentUser({ name, email });
    setAuthState("authenticated");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthState("login");
  };

  if (authState === "login") {
    return (
      <SafeAreaView style={styles.safe}>
        <LoginScreen
          onLogin={handleLogin}
          onSwitchToSignup={() => setAuthState("signup")}
        />
      </SafeAreaView>
    );
  }

  if (authState === "signup") {
    return (
      <SafeAreaView style={styles.safe}>
        <SignupScreen
          onSignup={handleSignup}
          onSwitchToLogin={() => setAuthState("login")}
        />
      </SafeAreaView>
    );
  }

  // Autenticado: vista simple (placeholder)
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>¡Hola, {currentUser?.name}!</Text>
        <Text style={styles.subtitle}>{currentUser?.email}</Text>

        <TouchableOpacity onPress={handleLogout} style={styles.button} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          En Construcción :)...
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0c" },
  container: { flex: 1, padding: 16, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", color: "#fff" },
  subtitle: { marginTop: 6, color: "#9ca3af" },
  button: {
    marginTop: 24,
    backgroundColor: "#6f5cff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  note: { marginTop: 20, color: "#9ca3af", textAlign: "center", fontSize: 12 },
});
