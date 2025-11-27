// src/screens/SignupScreen.tsx

import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
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

import { SignupSchema, SignUpFormType } from '../schemas/signUpSchema';
import { BRAND_COLORS as COLORS } from '../styles/Colors';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { signup, login } from '../services/authApi';
import { Alert } from 'react-native';

interface SignupScreenProps {
  onSignup?: (data: SignUpFormType) => void;
  onSignupSuccess?: () => void;
  onSwitchToLogin?: () => void;
  navigation?: any;
}

export function SignupScreen({
  onSignup,
  onSignupSuccess,
  onSwitchToLogin,
  navigation,
}: SignupScreenProps) {
  const insets = useSafeAreaInsets();

  const methods = useForm<SignUpFormType>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

const onSubmit = async (data: SignUpFormType) => {
    try {
      console.log('Datos de Registro:', data);

      // Si el padre pasó un handler custom, lo usamos y no tocamos API
      if (onSignup) {
        onSignup(data);
        return;
      }

      // 🔐 Llamada real a Nest
      const res = await signup({
        username: data.username,      // mapeo username -> name
        email: data.email,
        password: data.password,
      });

      // Si tu backend devuelve tokens en /auth/signup, los guardamos
      if (res.accessToken && res.refreshToken) {
        await AsyncStorage.setItem('accessToken', res.accessToken);
        await AsyncStorage.setItem('refreshToken', res.refreshToken);

        // callback opcional
        if (onSignupSuccess) onSignupSuccess();

        // Ir directo al app (como en LoginScreen)
        if (navigation) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          });
        }
        return;
      }

      // Si NO devuelve tokens, asumimos que solo crea el user
      // y mandamos a Login o callback
      if (res.accessToken && res.refreshToken) {
        // already handled above, but keep safety
        if (onSignupSuccess) onSignupSuccess();
        if (navigation) {
          navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
        }
        return;
      }

      // If backend didn't return tokens, try to log the user in automatically
      try {
        const loginRes = await login(data.email, data.password);
        // Persist tokens if returned
        if (loginRes?.accessToken && loginRes?.refreshToken) {
          try {
            await AsyncStorage.setItem('accessToken', loginRes.accessToken);
            await AsyncStorage.setItem('refreshToken', loginRes.refreshToken);
          } catch (err) {
            console.warn('Failed to persist tokens after signup-login', err);
          }

          if (onSignupSuccess) onSignupSuccess();
          if (navigation) {
            navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
          }
          return;
        }

        // If login also didn't return tokens, fall back to callbacks/navigation
        if (onSignupSuccess) {
          onSignupSuccess();
        } else if (onSwitchToLogin) {
          onSwitchToLogin();
        } else if (navigation) {
          navigation.replace('Login');
        }
      } catch (loginErr: any) {
        console.warn('Auto-login after signup failed', loginErr);
        // Fall back to redirecting to login screen and inform the user
        Alert.alert('Registro completado', 'Tu cuenta fue creada. Inicia sesión para continuar.');
        if (onSwitchToLogin) {
          onSwitchToLogin();
        } else if (navigation) {
          navigation.replace('Login');
        }
      }
    } catch (err: any) {
      console.error('Error en signup', err?.response?.data || err.message);
      // Aquí puedes poner un Alert / toast
    }
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
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>
              Únete y comienza tus rachas con amigos
            </Text>
          </View>

          {/* FORM CARD */}
          <View style={styles.formCard}>
            <FormProvider {...methods}>
              <View style={styles.inputGroup}>
                <FormInput
                  name="username"
                  label="Nombre completo"
                  placeholder="Tu nombre"
                />
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
                  onPress={handleSubmit(onSubmit)}
                  style={styles.loginButton}
                  isLoading={isSubmitting}
                >
                  <Text style={styles.loginButtonText}>Crear cuenta</Text>
                </Button>
              </View>
            </FormProvider>

            {/* LINK A LOGIN */}
            <View style={styles.loginLinkContainer}>
              <View style={styles.loginRow}>
                <Text style={styles.loginLinkText}>¿Ya tienes cuenta?</Text>
                <Button
                  variant="link"
                  onPress={() => {
                    if (onSwitchToLogin) return onSwitchToLogin();
                    if (navigation) return navigation.replace('Login');
                  }}
                  style={styles.loginLinkButton}
                >
                  Iniciar sesión
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// 🎨 Reutilizamos mismos estilos base que LoginScreen
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

  // --- Botón principal ---
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

  // --- Link para volver a Login ---
  loginLinkContainer: {
    marginTop: 30,
  },
  loginLinkText: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
  },
  loginLink: {
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    fontSize: 14,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loginLinkButton: {
    paddingHorizontal: 6,
  },
});

export default SignupScreen;
