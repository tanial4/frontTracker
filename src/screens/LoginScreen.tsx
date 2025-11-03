import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Platform, KeyboardAvoidingView, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormType, LoginSchema } from '../schemas/logInSchema'; 
import { FormInput } from '../components/forms/formInput';
import { Button } from '../components/ui/button'; 

import { Flame } from 'lucide-react-native'; // Para el icono de la llama
import { Eye } from 'lucide-react-native'; // Para el icono de visibilidad/ojo
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Para los insets de Safe Area

type AuthStatus = 'loggedOut' | 'signedIn' | 'signingUp' | 'recovery';

export default function LoginScreen() {
    const insets = useSafeAreaInsets();
    
    const methods = useForm<LoginFormType>({
        resolver: zodResolver(LoginSchema),
        defaultValues: { email: '', password: '' },
        mode: 'onBlur', 
    });

    const { handleSubmit } = methods;
    const { isSubmitting, errors } = methods.formState; // Obtener errores del formulario

    const [localAuthState, setLocalAuthState] = useState<AuthStatus>('loggedOut'); 
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Para el control de visibilidad de contraseña

    const onSubmit = (data: LoginFormType) => {
        setIsLoading(true);
        console.log("Datos de inicio de sesión:", data);
        // Simular una llamada a API
        setTimeout(() => {
            setLocalAuthState('signedIn'); // O redirigir
            setIsLoading(false);
            console.log("Inicio de sesión simulado exitoso.");
        }, 1500);
    };

    const handleSwitchToSignup = () => {
        console.log("Navegar a Registro");
        setLocalAuthState('signingUp');
    };
    const handleForgotPassword = () => {
        console.log("Navegar a Recuperar Contraseña");
        setLocalAuthState('recovery');
    };
    const handleDemoLogin = () => {
        console.log("Iniciando sesión como Demo");
        // Lógica para login demo (ej. rellenar formulario y enviar)
        methods.setValue('email', 'demo@example.com');
        methods.setValue('password', 'password');
        handleSubmit(onSubmit)(); // Enviar el formulario demo
    };

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <KeyboardAvoidingView 
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollViewContent} 
                    showsVerticalScrollIndicator={false}
                >
                    {/* Sección Superior: Logo y Títulos */}
                    <View style={styles.headerContainer}>
                        <View style={styles.logoWrapper}>
                            <Flame size={32} color={COLORS.iconColor} />
                        </View>
                        <Text style={styles.title}>¡Bienvenido de vuelta!</Text>
                        <Text style={styles.subtitle}>Continúa con tus rachas junto a tus amigos</Text>
                    </View>

                    {/* Contenedor del Formulario (Tarjeta) */}
                    <View style={styles.formCard}>
                        <FormProvider {...methods}>
                            <View style={styles.inputGroup}>
                                {/* Input de Email */}
                                <FormInput 
                                    name="email" 
                                    label="Email" 
                                    keyboardType="email-address" 
                                    autoCapitalize="none"
                                    placeholder="ejemplo@correo.com"
                                />
                                {/* Input de Contraseña */}
                                <FormInput 
                                    name="password" 
                                    label="Contraseña" 
                                    isPassword={!showPassword} // Controla la visibilidad
                                    secureTextEntry={!showPassword}
                                    placeholder="••••••••"
                                    // Icono de ojo para toggle de contraseña
                                    rightIcon={
                                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordToggle}>
                                            <Eye size={20} color={COLORS.textMuted} />
                                        </TouchableOpacity>
                                    }
                                />
                                {/* Enlace de Olvidaste Contraseña */}
                                <TouchableOpacity 
                                    onPress={handleForgotPassword} 
                                    style={styles.forgotPasswordButton}
                                >
                                    <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Botón de Iniciar Sesión */}
                            <Button 
                                onPress={handleSubmit(onSubmit)} 
                                style={[
                                    styles.loginButton, 
                                    
                                ]}
                                textStyle={styles.loginButtonText}
                                isLoading={isSubmitting} // Pasamos la prop isLoading al componente Button
                            >
                                Iniciar Sesión
                            </Button>
                        </FormProvider>
                    </View>

                    {/* Enlace a Registro */}
                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>
                            ¿No tienes cuenta?{' '}
                            <Text onPress={handleSwitchToSignup} style={styles.signupLink}>
                                Regístrate
                            </Text>
                        </Text>
                    </View>

                    {/* Sección de Login Demo */}
                    <View style={styles.demoCard}>
                        <Text style={styles.demoTitle}>Demo rápido:</Text>
                        <Button 
                            onPress={handleDemoLogin} 
                            style={styles.demoButton}
                            textStyle={styles.demoButtonText}
                        >
                            Entrar como Demo
                        </Button>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// 🚨 Paleta de Colores Hardcodeada (por ahora, hasta que definas un tema) 🚨
// Puedes usar tus valores Hex de tu global.css aquí
const COLORS = {
    // Paleta de Colores (Light Mode)
    background: '#FFFFFF',
    textPrimary: '#000000',
    textSecondary: '#717182',
    textMuted: '#717182',
    primary: '#030213', // Naranja/Amarillo (Acento)
    buttonPrimaryBg: '#717182', // Gris de los botones
    buttonPrimaryText: '#FFFFFF',
    buttonSecondaryBg: '#f0f0f0', 
    borderColor: '#e5e7eb',
    errorText: '#d4183d',
    inputBackground: '#f9fafb',
    iconColor: '#fff' 
};

const styles = StyleSheet.create({
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