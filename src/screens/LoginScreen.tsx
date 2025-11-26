// src/screens/LoginScreen.tsx

import React from 'react';
import {
  View,
  Text,  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Flame } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FormInput } from '../components/forms/formInput';
import { Button } from '../components/ui/button';
import { BRAND_COLORS as COLORS } from '../styles/Colors';
import { LoginFormType, LoginSchema } from '../schemas/logInSchema';
<<<<<<< HEAD
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../services/authApi';
=======
>>>>>>> 41fafb75eae67febecb943a0442923b520783de8

// Ajusta estos imports al nombre real de tu schema de login


interface LoginScreenProps {
  onLogin: () => void;           // lo maneja RootNavigator (handleLogin)
  onDemoLogin: () => void;       // lo maneja RootNavigator (handleDemoLogin)
  onSwitchToSignup: () => void;  // navega a Signup en el AuthStack
}

export function LoginScreen({
  onLogin,
  onSwitchToSignup,
}: LoginScreenProps) {
  const insets = useSafeAreaInsets();

  const methods = useForm<LoginFormType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

<<<<<<< HEAD
  const handleLoginSubmit =async (data: LoginFormType) => {
=======
  const handleLoginSubmit = (data: LoginFormType) => {
>>>>>>> 41fafb75eae67febecb943a0442923b520783de8
    console.log('Login data:', data);
    // Aquí luego harás tu llamada al backend

    const res = await login(data.email, data.password);
    await AsyncStorage.setItem('accessToken', res.accessToken);
    await AsyncStorage.setItem('refreshToken', res.refreshToken);

    onLogin(); // RootNavigator se encarga de cambiar isAuthenticated
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.headerContainer}>
            <View style={styles.logoWrapper}>
              <Flame size={32} color={COLORS.BACKGROUND_DEFAULT} />
            </View>
            <Text style={styles.title}>LifeTraker</Text>
            <Text style={styles.subtitle}>
              Inicia sesión para seguir tus metas y rachas
            </Text>
          </View>

          {/* FORM CARD */}
          <View style={styles.formCard}>
            <FormProvider {...methods}>
              <View style={styles.inputGroup}>
                <FormInput
                  name="email"
                  label="Email"
                  keyboardType="email-address"
                  placeholder="tu@email.com"
                />
                <FormInput
                  name="password"
                  label="Contraseña"
                  isPassword
                  placeholder="Mínimo 6 caracteres"
                />

                <Button
                  onPress={handleSubmit(handleLoginSubmit)}
                  style={styles.loginButton}
                  isLoading={isSubmitting}
                >
                  <Text style={styles.loginButtonText}>Iniciar sesión</Text>
                </Button>
              </View>
            </FormProvider>

            {/* ENLACE A SIGNUP */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>
                ¿Aún no tienes cuenta?{' '}
                <Text
                  style={styles.signupLink}
                  onPress={onSwitchToSignup}
                >
                  Crear cuenta
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// 🎨 Estilos compartidos con SignupScreen
const styles = StyleSheet.create({
  // --- Layout Base ---
  safeArea: { flex: 1, backgroundColor: COLORS.BACKGROUND_DEFAULT },
  keyboardAvoidingView: { flex: 1 },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },

  // --- Header ---
  headerContainer: { alignItems: 'center', marginBottom: 30 },
  logoWrapper: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 3,
  },
  subtitle: {
    color: COLORS.TEXT_MUTED,
    fontSize: 14,
    textAlign: 'center',
  },

  // --- Formulario (Tarjeta) ---
  formCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 12,
    padding: 20,
  },
  inputGroup: {
    gap: 12,
    marginBottom: 20,
  },

  // --- Botones y Enlaces ---
  loginButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY_BG,
    paddingVertical: 10,
    borderRadius: 8,
  },
  loginButtonText: {
    color: COLORS.BUTTON_PRIMARY_TEXT,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonDisabled: { opacity: 0.5 },

  forgotPasswordButton: { alignSelf: 'flex-end', marginTop: 12 },
  forgotPasswordText: {
    fontWeight: '500',
    color: COLORS.TEXT_MUTED,
    fontSize: 13,
  },

  // --- Footer: link a Signup ---
  signupContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    marginTop: 8,
  },
  signupText: { fontSize: 14, color: COLORS.TEXT_MUTED },
  signupLink: {
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    fontSize: 14,
  },

  // --- Demo Rápido ---
  demoCard: {
    marginTop: 30,
    width: '100%',
    maxWidth: 380,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
    backgroundColor: COLORS.INPUT_BACKGROUND,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  demoTitle: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
  demoButton: {
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
    borderColor: COLORS.BORDER_COLOR,
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 8,
  },
  demoButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default LoginScreen;