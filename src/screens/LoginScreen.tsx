// src/screens/LoginScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Flame, Eye } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LoginFormType, LoginSchema } from '../schemas/logInSchema';
import { FormInput } from '../components/forms/formInput';
import { Button } from '../components/ui/button';
import { BRAND_COLORS as COLORS } from '../styles/Colors';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../services/authApi';

// 🔹 Navigation
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../components/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const methods = useForm<LoginFormType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginFormType) => {
    try {
      console.log('Datos de inicio de sesión:', data);

      // 🔐 Aquí iría tu llamada real a la API de autenticación
      // await authService.login(data.email, data.password);
      const res = await login(data.email, data.password);
      await AsyncStorage.setItem('accessToken', res.accessToken);
      await AsyncStorage.setItem('refreshToken', res.refreshToken);

      // Simulación de delay (resolver sin argumentos para cumplir la firma esperada)
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 1200));

      console.log('Inicio de sesión simulado exitoso.');

      //  Navegar al tab principal y limpiar historial
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (err) {
      console.error('Error en login', err);
      // Aquí podrías mostrar un toast o mensaje de error
    }
  };

  const handleSwitchToSignup = () => {
    navigation.navigate('Signup');
  };

  const handleForgotPassword = () => {
    navigation.navigate('PasswordRecovery');
  };

  const handleDemoLogin = () => {
    setValue('email', 'demo@example.com');
    setValue('password', 'password-demo');
    handleSubmit(onSubmit)();
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
          keyboardShouldPersistTaps="handled"
        >
          {/* HEADER */}
          <View style={styles.headerContainer}>
            <View style={styles.logoWrapper}>
              <Flame size={32} color={COLORS.BACKGROUND_DEFAULT} />
            </View>
            <Text style={styles.title}>¡Bienvenido de vuelta!</Text>
            <Text style={styles.subtitle}>
              Continúa con tus rachas junto a tus amigos
            </Text>
          </View>

          {/* CARD FORMULARIO */}
          <View style={styles.formCard}>
            <FormProvider {...methods}>
              <View style={styles.inputGroup}>
                <FormInput
                  name="email"
                  label="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="ejemplo@correo.com"
                />

                <FormInput
                  name="password"
                  label="Contraseña"
                  isPassword={!showPassword}
                  secureTextEntry={!showPassword}
                  placeholder="••••••••"
                  rightIcon={
                    <TouchableOpacity
                      onPress={() => setShowPassword((prev) => !prev)}
                      style={styles.passwordToggle}
                    >
                      <Eye size={20} color={COLORS.TEXT_MUTED} />
                    </TouchableOpacity>
                  }
                />

                <TouchableOpacity
                  onPress={handleForgotPassword}
                  style={styles.forgotPasswordButton}
                >
                  <Text style={styles.forgotPasswordText}>
                    ¿Olvidaste tu contraseña?
                  </Text>
                </TouchableOpacity>
              </View>

              <Button
                onPress={handleSubmit(onSubmit)}
                isLoading={isSubmitting}
              >
                <Text>Iniciar sesión</Text>
              </Button>
            </FormProvider>
          </View>

          {/* LINK A SIGNUP */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>
              ¿No tienes cuenta?{' '}
              <Text
                onPress={handleSwitchToSignup}
                style={styles.signupLink}
              >
                Regístrate
              </Text>
            </Text>
          </View>

          {/* DEMO */}
          <View style={styles.demoCard}>
            <Text style={styles.demoTitle}>Demo rápido:</Text>
            <Button
              onPress={handleDemoLogin}
              style={styles.demoButton}
              textStyle={styles.demoButtonText}
            >
              <Text>Iniciar como Demo</Text>
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.BACKGROUND_DEFAULT },
  keyboardAvoidingView: { flex: 1 },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },

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
  subtitle: { color: COLORS.TEXT_MUTED, fontSize: 14, textAlign: 'center' },

  passwordToggle: {
    padding: 8,
  },

  formCard: {
    width: '100%',
    maxWidth: 380,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  inputGroup: { gap: 12, marginBottom: 20 },

  forgotPasswordButton: { alignSelf: 'flex-end', marginTop: 12 },
  forgotPasswordText: {
    fontWeight: '500',
    color: COLORS.TEXT_MUTED,
    fontSize: 13,
  },

  signupContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    marginTop: 32,
  },
  signupText: { fontSize: 14, color: COLORS.TEXT_MUTED },
  signupLink: { fontWeight: 'bold', color: COLORS.PRIMARY, fontSize: 14 },

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
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    borderColor: COLORS.BORDER_COLOR,
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 8,
  },
  demoButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
    fontSize: 15,
  },
});
