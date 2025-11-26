import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Platform, KeyboardAvoidingView, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Mail, ArrowLeft, Flame } from 'lucide-react-native'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BRAND_COLORS } from '../styles/Colors';
import {globalLayout, formComponentStyles} from '../styles/GlobalStyles';
import { RecoverySchema, RecoveryFormType } from '../schemas/recoveryPassword'; 
import { FormInput } from '../components/forms/formInput'; 
import { Button } from '../components/ui/button'; 


interface PasswordRecoveryScreenProps {
    onGoBack: () => void;
    onRecoveryLinkSent: () => void;
}

export function PasswordRecoveryScreen({ onGoBack, onRecoveryLinkSent }: PasswordRecoveryScreenProps) {
    const insets = useSafeAreaInsets();
    const [isSending, setIsSending] = useState(false);

    const methods = useForm<RecoveryFormType>({
        resolver: zodResolver(RecoverySchema),
        defaultValues: { email: '' },
        mode: 'onBlur',
    });
    
    const { handleSubmit, formState: { errors, isValid } } = methods;

    const onSubmit = (data: RecoveryFormType) => {
        setIsSending(true);
        setTimeout(() => {
            setIsSending(false);
            onRecoveryLinkSent(); 
        }, 2000);
    };

    const canSubmit = isValid && !isSending;

    return (
        <SafeAreaView style={[globalLayout.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <KeyboardAvoidingView 
                style={globalLayout.keyboardAvoidingView}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollViewContentOverride} showsVerticalScrollIndicator={false}>
                    
                    <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
                        <ArrowLeft size={24} color={BRAND_COLORS.TEXT_PRIMARY} />
                        <Text style={styles.backButtonText}>Atrás</Text>
                    </TouchableOpacity>

                    <View style={globalLayout.headerContainer}>
                        <View style={globalLayout.logoWrapper}>
                            <Flame size={32} color={BRAND_COLORS.PRIMARY} /> 
                        </View>
                        <Text style={globalLayout.title}>¿Olvidaste tu contraseña?</Text>
                        <Text style={globalLayout.subtitle}>No te preocupes, te enviaremos instrucciones para recuperarla</Text>
                    </View>

                    <View style={formComponentStyles.formCardBase}>
                        <FormProvider {...methods}>
                            <View style={formComponentStyles.inputGroup}>
                                <FormInput
                                    name="email"
                                    label="Email"
                                    keyboardType="email-address"
                                    placeholder="tu@email.com"
                                    isInvalid={!!errors.email}
                                />

                                <Text style={formComponentStyles.helpSubtitle}>Ingresa el email asociado a tu cuenta</Text>
                                
                                <Button
                                    onPress={handleSubmit(onSubmit)}
                                    style={[
                                        styles.submitButton
                                    ]}
                                    textStyle={formComponentStyles.loginButtonText}
                                    isLoading={isSending}
                                    disabled={!canSubmit}
                                >   <Text>Enviar enlace de recuperación</Text>
                                </Button>
                            </View>
                        </FormProvider>
                    </View>

                    <View style={formComponentStyles.helpCard}>
                        <View style={formComponentStyles.helpIconTextWrapper}>
                            <Mail size={24} color={BRAND_COLORS.PRIMARY} />
                            <View style={formComponentStyles.helpTextWrapper}>
                                <Text style={formComponentStyles.helpTitle}>¿No recibes el email?</Text>
                                <Text style={formComponentStyles.helpSubtitle}>Revisa tu carpeta de spam o correo no deseado</Text>
                            </View>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    scrollViewContentOverride: {
        ...globalLayout.scrollViewContent,
        paddingHorizontal: 0, 
    },
    
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginBottom: 30,
        marginTop: 10,
    },
    backButtonText: {
        fontSize: 16,
        color: BRAND_COLORS.TEXT_PRIMARY,
        marginLeft: 8,
    },
    
    
    submitButton: {
        backgroundColor: BRAND_COLORS.PRIMARY, 
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
   
});