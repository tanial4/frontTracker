import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, StyleSheet, Alert } from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react-native'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker'; // 🚨 Importar la librería de imagen
import { ProfilePhotoPicker } from '../../components/forms/ProfilePhotoPicker'; // 🚨 Nuevo componente modular

// 🚨 Importaciones Modulares 🚨
import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { globalLayout, formComponentStyles } from '../../styles/GlobalStyles'; 
import { FormInput } from '../../components/forms/formInput';
import { Button } from '../../components/ui/button';
import { ProfileFormType, ProfileSchema } from '../../schemas/profileSchema';


// --- Pantalla Principal ---
export function EditProfileScreen() {
    const insets = useSafeAreaInsets();
    
    // --- Lógica del Formulario ---
    const methods = useForm<ProfileFormType>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            avatarURL: undefined, // Simula una foto existente
            fullName: 'Usuario Demo',
            email: 'demo@ejemplo.com',
            bio: 'Apasionado por el desarrollo personal y la productividad. 🚀',
            location: 'Madrid, España',
            memberSince: 'Enero 2024',
        } as ProfileFormType,
        mode: 'onBlur',
    });

    const { handleSubmit, watch, formState: { isValid, isSubmitting } } = methods;

    const onSubmit = (data: ProfileFormType) => {
        console.log('Datos de Perfil a actualizar:', data);
        // Lógica de envío a la API aquí
    };

    const handleCancel = () => {
        console.log('Cancelando edición...');
        // Lógica para volver atrás o descartar cambios
    };
    
    const maxBioLength = 150;
    const currentBioLength = watch('bio')?.length || 0; // Usar watch para el contador
    
    // 🚨 Función que gestiona la selección de la imagen nativa (Integración RHF) 🚨
    const handleImageSelect = (onChange: (uri: string | undefined) => void) => {
    // Definición de opciones para la galería
    const options: ImageLibraryOptions = { // 👈 Tipamos el objeto con la interfaz correcta
        mediaType: 'photo', // 👈 'photo' (string) SÍ es un valor válido para el tipo interno de la librería
        quality: 0.7,
        includeBase64: true,
    };
    console.log("Abriendo selector de imagen con opciones:", options);
    // Llama al selector de galería
    launchImageLibrary(options, (response) => {
        if (response.didCancel) {
            console.log('Selección de imagen cancelada');
        } else if (response.errorMessage) {
            Alert.alert('Error', 'No se pudo seleccionar la imagen.');
        } else if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
            // Envía el URI de la imagen seleccionada a react-hook-form
            onChange(response.assets[0].uri); 
        } else {
            // Si no se selecciona nada o hay un error, pasamos undefined
            onChange(undefined);
        }
    });
};


    // --- Renderizado ---
    return (
        <View style={[styles.safeAreaOverride, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <KeyboardAvoidingView style={globalLayout.keyboardAvoidingView} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                
                {/* 1. Barra Superior (Atrás y Título) */}
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
                        <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Editar Perfil</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    <FormProvider {...methods}>
                        
                        {/* 🚨 1. SECCIÓN DE FOTO DE PERFIL (USA EL COMPONENTE MODULAR) 🚨 */}
                        <View style={styles.sectionContainer}>
                            <ProfilePhotoPicker
                                name="avatarURL" 
                                fullName={methods.watch('fullName')}
                                onImageSelect={handleImageSelect} 
                                isEditable={true}
                            />
                        </View>
                        
                        {/* 2. SECCIÓN DE INFORMACIÓN BÁSICA (TARJETA PRINCIPAL) */}
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
                                textAlignVertical='top'
                                maxLength={maxBioLength}
                                // 💡 Aquí aplicas el estilo que afecta al TextInput interno
                                customInputStyle={styles.bioInput} 
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
                        <View style={[styles.formCard, styles.statsCardOverride]}>
                            {/* Renderizar opciones de estadísticas */}
                            {/* ... (Tu lógica de optionRow con Lock y Text) ... */}
                        </View>

                        {/* 4. SECCIÓN DE ACCIONES DE CUENTA */}
                        <Text style={styles.sectionTitle}>Información de Cuenta</Text>
                        <View style={[styles.formCard, styles.buttonContainer]}>
                            <Button onPress={handleCancel} style={styles.cancelButton} textStyle={styles.cancelButtonText}>
                                Cancelar
                            </Button>
                            <Button 
                                onPress={handleSubmit(onSubmit)} 
                                style={styles.saveButton} 
                                textStyle={styles.saveButtonText}
                                disabled={isSubmitting || !isValid}
                                isLoading={isSubmitting}
                            >
                                Guardar Cambios
                            </Button>
                        </View>
                        
                    </FormProvider>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

// -------------------------------------------------------------
// 🚨 ESTILOS ESPECÍFICOS DE PROFILE SCREEN (LOCAL) 🚨
// -------------------------------------------------------------

const styles = StyleSheet.create({
    safeAreaOverride: { flex: 1, backgroundColor: COLORS.BACKGROUND_DEFAULT },
    
    // --- Layout Base y Títulos ---
    topBar: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, width: '100%',
        backgroundColor: COLORS.BACKGROUND_DEFAULT, borderBottomWidth: 1, borderColor: COLORS.BORDER_COLOR,
    },
    backButton: { paddingRight: 15 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.TEXT_PRIMARY },
    
    scrollContent: {
        paddingBottom: 40,
        paddingHorizontal: 0,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 14, fontWeight: 'bold', color: COLORS.TEXT_PRIMARY, marginTop: 30, marginBottom: 10, alignSelf: 'flex-start', marginLeft: 20,
    },
    
    // --- Avatar (La lógica de renderizado está en ProfilePhotoPicker) ---
    sectionContainer: { width: '90%', alignItems: 'center', marginBottom: 12 },

    // --- Formulario ---
    formCard: {
        ...formComponentStyles.formCardBase, 
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginBottom: 20,
        width: '95%',
        gap: 15, // Espacio entre FormInputs
        borderWidth: 0,
        shadowColor: COLORS.BACKGROUND_DEFAULT,
    },
    readOnlyField: {
        opacity: 0.7, 
    },
    readOnlyHelperText: {
        fontSize: 12,
        color: COLORS.TEXT_MUTED,
        marginTop: -15,
    },
    bioInput: {
        minHeight: 80, // 🚨 Estilo aplicado al TextInput interno del FormInput
        textAlignVertical: 'top',
        paddingVertical: 10,
    },
    charCounter: {
        fontSize: 12,
        color: COLORS.TEXT_MUTED,
        alignSelf: 'flex-end',
        marginTop: -27,
        marginBottom: 10,
        marginRight: 5,
    },
    
    // --- Estadísticas (Switches) ---
    statsCardOverride: {
        width: '90%',
        padding: 0,
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        // ...
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
        flex: 1, backgroundColor: COLORS.INPUT_BACKGROUND, paddingVertical: 12, borderRadius: 8, borderColor: COLORS.BORDER_COLOR, borderWidth: 1,
    },
    cancelButtonText: { color: COLORS.TEXT_PRIMARY, fontWeight: 'bold' },
    saveButton: {
        flex: 1, backgroundColor: COLORS.PRIMARY, paddingVertical: 12, borderRadius: 8,
    },
    saveButtonText: {
        color: COLORS.BACKGROUND_DEFAULT, fontWeight: 'bold',
    }
});