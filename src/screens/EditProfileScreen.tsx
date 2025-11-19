import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, StyleSheet, Image, TextInput } from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Camera, Lock } from 'lucide-react-native'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BRAND_COLORS as COLORS } from '../styles/Colors';
import { globalLayout, formComponentStyles } from '../styles/GlobalStyles'; 

import { FormInput } from '../components/forms/formInput';
import { Button } from '../components/ui/button';
import { ProfileFormType, ProfileSchema } from '../schemas/profileSchema';


type ImageUploadInputProps = {
    value?: string | null;
    onChange?: (uri: string | null) => void;
    error?: any;
    isEditable?: boolean;
};

const ImageUploadInput: React.FC<ImageUploadInputProps> = ({ value, onChange, error, isEditable = true }) => {
    const displayImage = value || null; 
    return (
        <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
                {displayImage ? (
                    <Image source={{ uri: displayImage }} style={styles.avatar} />
                ) : (
                    <Text style={styles.avatarText}>U</Text>
                )}
                {isEditable && (
                    <TouchableOpacity onPress={() => console.log('Abrir picker')} style={styles.cameraIconWrapper}>
                        <Camera size={16} color={COLORS.WHITE} />
                    </TouchableOpacity>
                )}
            </View>
            <Text style={styles.avatarHelperText}>Toca para cambiar foto de perfil</Text>
            {error && <Text style={formComponentStyles.errorText}>{String(error?.message ?? error)}</Text>}
        </View>
    );
};

// --- Pantalla Principal ---
export function EditProfileScreen() {
    const insets = useSafeAreaInsets();
    
    // --- Lógica del Formulario ---
    const methods = useForm<ProfileFormType>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            avatarURL: 'initial_uri', // Simula una foto existente
            fullName: 'Usuario Demo',
            email: 'demo@ejemplo.com',
            bio: 'Apasionado por el desarrollo personal y la productividad. 🚀',
            location: 'Madrid, España',
            memberSince: 'Enero 2024',
        } as ProfileFormType,
        mode: 'onBlur',
    });

    const { handleSubmit, control, formState: { errors, isValid, isSubmitting } } = methods;

    const onSubmit = (data: ProfileFormType) => {
        console.log('Datos de Perfil a actualizar:', data);
        // Lógica de envío a la API aquí
    };

    const handleCancel = () => {
        console.log('Cancelando edición...');
        // Lógica para volver atrás o descartar cambios
    };
    
    const maxBioLength = 150;
    const currentBioLength = ((methods.getValues() as any).bio ?? '').length || 0;


    // --- Renderizado ---
    return (
        <View style={[globalLayout.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <KeyboardAvoidingView style={globalLayout.keyboardAvoidingView} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                
                {/* Botón de Atrás y Título */}
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
                        <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Editar Perfil</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    <FormProvider {...methods}>
                        
                        {/* 1. SECCIÓN DE FOTO DE PERFIL */}
                        <View style={styles.sectionContainer}>
                            <ImageUploadInput
                                error={errors.avatarURL}
                                isEditable={true}
                                value={methods.getValues().avatarURL}
                                onChange={(uri) => methods.setValue('avatarURL', uri ?? '', { shouldValidate: true })}
                            />
                        </View>
                        
                        {/* 2. SECCIÓN DE INFORMACIÓN BÁSICA */}
                        <View style={styles.formCard}>
                            
                            {/* Campo Nombre Completo */}
                            <FormInput name="fullName" label="Nombre completo" />

                            {/* Campo Email (No Editable) */}
                            <View style={styles.readOnlyField}>
                                <FormInput 
                                    name="email" 
                                    label="Email" 
                                    editable={false} 
                                    placeholder="demo@ejemplo.com"
                                />
                                <Text style={styles.readOnlyHelperText}>
                                    El email no se puede cambiar
                                </Text>
                            </View>

                            {/* Campo Biografía (TextArea) */}
                            <FormInput
                                name="bio"
                                label="Biografía"
                                multiline={true}
                                placeholder="Describe tu pasión..."
                                numberOfLines={4}
                                maxLength={maxBioLength}
                                style={styles.bioInput}
                            />
                            {/* Contador de Caracteres */}
                            <Text style={styles.charCounter}>
                                {currentBioLength}/{maxBioLength} caracteres
                            </Text>

                            {/* Campo Ubicación */}
                            <FormInput name="location" label="Ubicación" />
                        </View>

                        {/* 3. SECCIÓN DE ESTADÍSTICAS PÚBLICAS (Switches simulados) */}
                        <Text style={styles.sectionTitle}>Estadísticas Públicas</Text>
                        <View style={styles.formCard}>
                            <View style={styles.optionRow}>
                                <Text style={styles.optionText}>Mostrar rachas activas</Text>
                                <Lock size={20} color={COLORS.primary} />
                                {/* <Switch value={true} onValueChange={() => {}} /> */}
                            </View>
                            <View style={styles.optionRow}>
                                <Text style={styles.optionText}>Mostrar ranking</Text>
                                <Lock size={20} color={COLORS.primary} />
                            </View>
                            <View style={styles.optionRow}>
                                <Text style={styles.optionText}>Mostrar logros</Text>
                                <Lock size={20} color={COLORS.primary} />
                            </View>
                        </View>

                        {/* 4. SECCIÓN DE ACCIONES DE CUENTA */}
                        <Text style={styles.sectionTitle}>Información de Cuenta</Text>
                        <View style={[styles.formCard, styles.buttonContainer]}>
                            <Button onPress={handleCancel} style={styles.cancelButton} textStyle={styles.cancelButtonText}>
                                <Text>Cancelar</Text>
                            </Button>
                            <Button 
                                onPress={handleSubmit(onSubmit)} 
                                style={styles.saveButton} 
                                textStyle={styles.saveButtonText}
                                disabled={isSubmitting || !isValid}
                                isLoading={isSubmitting}
                            >
                                <Text>Guardar Cambios</Text>
                            </Button>
                        </View>
                        
                    </FormProvider>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

// -------------------------------------------------------------
// ESTILOS ESPECÍFICOS DE PROFILE SCREEN
// -------------------------------------------------------------

const styles = StyleSheet.create({
    // --- Layout Base y Títulos ---
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: COLORS.WHITE,
        borderBottomWidth: 1,
        borderColor: COLORS.GRAY_BORDER,
        width: '100%',
    },
    backButton: {
        paddingRight: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.TEXT_PRIMARY,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.TEXT_PRIMARY,
        marginTop: 30,
        marginBottom: 10,
        alignSelf: 'flex-start',
        marginLeft: 20,
    },
    sectionContainer: {
        width: '90%',
        alignItems: 'center',
        marginBottom: 12,
    },
    scrollContent: {
        paddingBottom: 40,
        paddingHorizontal: 0,
        alignItems: 'center',
    },

    // --- Avatar ---
    avatarContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.GRAY_ACCENT,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: COLORS.TEXT_MUTED,
    },
    cameraIconWrapper: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.primary, // Púrpura
        borderRadius: 15,
        padding: 5,
        borderWidth: 2,
        borderColor: COLORS.WHITE,
    },
    avatarHelperText: {
        fontSize: 13,
        color: COLORS.TEXT_MUTED,
    },

    // --- Formulario ---
    formCard: {
        ...formComponentStyles.formCardBase, // Usa estilos base de tarjeta
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginBottom: 20,
        width: '90%',
        gap: 15, // Espacio entre FormInputs
    },
    readOnlyField: {
        // Estilo para el input de email que está deshabilitado
        opacity: 0.7, 
    },
    readOnlyHelperText: {
        fontSize: 12,
        color: COLORS.TEXT_MUTED,
        marginTop: 4,
    },
    bioInput: {
        minHeight: 80,
        textAlignVertical: 'top',
        paddingVertical: 10,
    },
    charCounter: {
        fontSize: 12,
        color: COLORS.TEXT_MUTED,
        alignSelf: 'flex-end',
        marginTop: -10,
        marginBottom: 10,
        marginRight: 5,
    },
    
    // --- Estadísticas (Switches) ---
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: COLORS.GRAY_ACCENT,
    },
    optionText: {
        fontSize: 16,
        color: COLORS.TEXT_PRIMARY,
        flex: 1,
    },

    // --- Botones de Acción (Guardar/Cancelar) ---
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        gap: 10,
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: COLORS.GRAY_ACCENT,
        paddingVertical: 12,
        borderRadius: 8,
        borderColor: COLORS.GRAY_BORDER,
        borderWidth: 1,
    },
    cancelButtonText: {
        color: COLORS.TEXT_PRIMARY,
        fontWeight: 'bold',
    },
    saveButton: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        borderRadius: 8,
    },
    saveButtonText: {
        color: COLORS.WHITE,
        fontWeight: 'bold',
    }
});