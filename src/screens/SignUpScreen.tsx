import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Platform, KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Flame } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FormInput } from '../components/forms/formInput'; 
import { Button } from '../components/ui/button'; 
import { SignupSchema, SignUpFormType } from '../schemas/signUpSchema'; 


const COLORS = {
    background: '#FFFFFF',
    textPrimary: '#000000',
    textMuted: '#717182',
    primary: '#fff', 
    buttonPrimaryBg: '#7c3aed',
    buttonPrimaryText: '#FFFFFF',
    borderColor: '#e5e7eb',
    errorText: '#d4183d',
    inputBackground: '#f9fafb',
    textSecondary: '#717182',
};

interface SignupScreenProps {
    onSignup: (data: SignUpFormType) => void; 
    onSwitchToLogin: () => void;
}

export function SignupScreen({ onSignup, onSwitchToLogin }: SignupScreenProps) {
    const insets = useSafeAreaInsets();

    const methods = useForm<SignUpFormType>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        mode: 'onBlur',
    });

    const { handleSubmit, formState: { isSubmitting, errors } } = methods;

    const onSubmit = (data: SignUpFormType) => {
        console.log('Datos de Registro:', data);
        onSignup(data); 
    };

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <KeyboardAvoidingView 
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                    
                    <View style={styles.headerContainer}>
                        <View style={styles.logoWrapper}>
                            <Flame size={32} color={COLORS.primary} />
                        </View>
                        <Text style={styles.title}>Crear cuenta</Text>
                        <Text style={styles.subtitle}>Únete y comienza tus rachas con amigos</Text>
                    </View>
                    <View style={styles.formCard}>
                        <FormProvider {...methods}>
                            <View style={styles.inputGroup}>
                                <FormInput name="username" label="Nombre completo" placeholder="Tu nombre" />
                                <FormInput name="email" label="Email" keyboardType="email-address" placeholder="tu@email.com" />
                                <FormInput name="password" label="Contraseña" isPassword={true} placeholder="Mínimo 6 caracteres" />
                                <FormInput name="confirmPassword" label="Confirmar contraseña" isPassword={true} placeholder="Confirma tu contraseña" />
                                <Button 
                                    onPress={handleSubmit(onSubmit)} 
                                    style={[styles.loginButton]}
                                    textStyle={styles.signupButtonText} 
                                    isLoading={isSubmitting}
                                >
                                    <Text>Crear Cuenta</Text>
                                </Button>
                            </View>
                        </FormProvider>
                    </View>
                    <View style={styles.loginLinkContainer}>
                        <Text style={styles.loginLinkText}>
                            ¿Ya tienes cuenta?
                            <Text onPress={onSwitchToLogin} style={styles.loginLinkText}>
                                {' '}Iniciar sesión
                            </Text>
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// 🚨 Definición de Estilos (Alineados con LoginScreen) 🚨
// ... (Utiliza el mismo bloque de estilos StyleSheet.create que definimos para LoginScreen,
//       pero asegúrate de añadir:

const styles = StyleSheet.create({
    // ... (Estilos de LoginScreen para safeArea, formCard, etc.) ...
    
    // NUEVOS ESTILOS
    loginLinkContainer: {
        marginTop: 30, 
    },
    loginLinkText: {
        fontSize: 14,
        color: COLORS.textMuted,
        textAlign: 'center',
    },
    loginLink: {
        fontWeight: 'bold',
        color: COLORS.primary, // Color de acento púrpura
        fontSize: 14,
    },
    signupButtonText: {
        color: COLORS.buttonPrimaryText, // Blanco
        fontWeight: '600',
        fontSize: 16,
    },
    // --- Layout Base ---
    safeArea: { flex: 1, backgroundColor: COLORS.background },
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
        width: 60, height: 60, borderRadius: 15,
        backgroundColor: COLORS.buttonPrimaryBg, 
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 12,
    },
    title: { fontSize: 20, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 3 },
    subtitle: { color: COLORS.textSecondary, fontSize: 14, textAlign: 'center' },

    // --- Formulario (Tarjeta) ---
    formCard: {
        width: '100%', maxWidth: 380,
        borderWidth: 1, borderColor: COLORS.borderColor,
        backgroundColor: COLORS.background,
        borderRadius: 12, padding: 20,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1, shadowRadius: 3, elevation: 3,
    },
    inputGroup: { gap: 12, marginBottom: 20 },

    // --- Botones y Enlaces ---
    loginButton: {
        backgroundColor: COLORS.buttonPrimaryBg,
        paddingVertical: 10, borderRadius: 8,
    },
    loginButtonText: {
        color: COLORS.buttonPrimaryText, fontSize: 15, fontWeight: '600',
    },
    buttonDisabled: { opacity: 0.5 },

    forgotPasswordButton: { alignSelf: 'flex-end', marginTop: 12 },
    forgotPasswordText: { fontWeight: '500', color: COLORS.textMuted, fontSize: 13 },
    
    // --- Footer ---
    signupContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 16, marginTop: 32 },
    signupText: { fontSize: 14, color: COLORS.textMuted },
    signupLink: { fontWeight: 'bold', color: COLORS.primary, fontSize: 14 },

    // --- Demo Rápido ---
    demoCard: {
        marginTop: 30, width: '100%', maxWidth: 380,
        borderRadius: 12, borderWidth: 1,
        borderColor: COLORS.borderColor,
        backgroundColor: COLORS.inputBackground, 
        padding: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
    },
    demoTitle: { color: COLORS.textPrimary, fontWeight: '500', marginBottom: 10, textAlign: 'center' },
    demoButton: {
        backgroundColor: COLORS.background, // Botón secundario blanco
        borderColor: COLORS.borderColor,
        borderWidth: 1,
        paddingVertical: 10,
        borderRadius: 8,
    },
    demoButtonText: { color: COLORS.textPrimary, fontWeight: '600', fontSize: 15 },
});