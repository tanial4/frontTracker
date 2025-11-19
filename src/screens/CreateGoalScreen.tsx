import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FormProvider, useForm } from 'react-hook-form'; // 🚨 Importaciones de RHF
import { zodResolver } from '@hookform/resolvers/zod';

// 🚨 Importaciones de Componentes y Lógica 🚨
import { BRAND_COLORS as COLORS } from '../styles/Colors';
import { globalLayout } from '../styles/GlobalStyles'; 
import { CreateGoalForm } from '../components/forms/CreateGoalForm'; 
import { GoalSchema, GoalFormType } from '../schemas/createGoalSchema'; 
import { MOCK_CATEGORIES } from '../data/Categories';
import { GOAL_TEMPLATES } from '../data/GoalsTypes';
import { TemplateCard } from '../components/goals/templateGoaldCard';
import { ActivityCategory, GoalTemplate } from '../interfaces/goal';

// --- Tipos de Datos (Asumidos del contexto) ---

interface MasterScreenProps { onGoBack: () => void; onGoalCreated: (data: GoalFormType) => void; }


export function CreateGoalScreen({ onGoBack, onGoalCreated }: MasterScreenProps) {
    const insets = useSafeAreaInsets();
    
    // 🚨 Estado para almacenar el objeto completo de la plantilla seleccionada 🚨
    const [selectedTemplate, setSelectedTemplate] = useState<GoalTemplate | undefined>(undefined); 

    // --- RHF SETUP (Se hace una sola vez en el componente maestro) ---
    const methods = useForm<GoalFormType>({
        resolver: zodResolver(GoalSchema),
        defaultValues: {} as GoalFormType, // Se inicializará con el reset del formulario hijo
        mode: 'onBlur',
    });
    // ------------------------------------------------------------------

    const handleTemplateSelect = (template: GoalTemplate) => {
        // Al hacer clic, guardamos el objeto completo de la plantilla seleccionada.
        setSelectedTemplate(template);
    };

    const handleCreateCustom = () => {
        // Deselecciona la plantilla para cargar el formulario vacío
        setSelectedTemplate(undefined); 
    };

    const allCategoriesTyped = MOCK_CATEGORIES as ActivityCategory[];
    const templatesToRender = GOAL_TEMPLATES as GoalTemplate[];

    return (
        <View style={[styles.safeAreaOverride, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <KeyboardAvoidingView style={globalLayout.keyboardAvoidingView} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
                        <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
                    </TouchableOpacity>
                    <Text style={styles.mainTitle}>Crear Nueva Meta</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    {/* --- 1. SECCIÓN DE SELECCIÓN DE PLANTILLAS (ARRIBA) --- */}
                    <Text style={styles.sectionHeading}>Selecciona una meta</Text>
                    <View style={styles.cardGrid}>
                        {templatesToRender.map((template) => (
                            <TemplateCard 
                                key={template.id}
                                template={template}
                                allCategories={allCategoriesTyped}
                                isActive={selectedTemplate?.id === template.id} 
                                onSelect={() => handleTemplateSelect(template)} // 🚨 Guarda el objeto
                            />
                        ))}
                    </View>

                    {/* --- 2. FORMULARIO DE EDICIÓN (ABAJO) --- */}
                    <View style={styles.formContainer}>                        
                        {/* 🚨 PROVEEDOR DE FORMULARIO: Envuelve toda la sección de edición 🚨 */}
                        <FormProvider {...methods}>
                            <CreateGoalForm
                                methods={methods} // 👈 Pasamos los métodos al componente hijo
                                onCancel={onGoBack}
                                onCreate={onGoalCreated}
                                initialTemplate={selectedTemplate} // 👈 PROP CRÍTICA PARA EL PRERRELLENADO
                                allCategories={allCategoriesTyped}
                            />
                        </FormProvider>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

// -------------------------------------------------------------
// ESTILOS DE LA PANTALLA MASTER
// -------------------------------------------------------------

const styles = StyleSheet.create({
    safeAreaOverride: { flex: 1, backgroundColor: COLORS.WHITE },
    topBar: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, width: '100%',
        backgroundColor: COLORS.WHITE, borderBottomWidth: 1, borderColor: COLORS.GRAY_BORDER,
    },
    backButton: { paddingRight: 15 },
    mainTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: COLORS.TEXT_PRIMARY, textAlign: 'center' },
    
    scrollContent: {
        flexGrow: 1, paddingBottom: 40, paddingHorizontal: 0, alignItems: 'center',
    },
    sectionHeading: {
        fontSize: 16, fontWeight: 'bold', color: COLORS.TEXT_PRIMARY, marginTop: 20, marginBottom: 15,
        alignSelf: 'flex-start', marginLeft: 10,
    },
    
    // --- Cuadrícula de Tarjetas ---
        cardGrid: {
    flexDirection: 'row', 
    flexWrap: 'wrap', // 🚨 CRÍTICO: Permite que las tarjetas bajen a la siguiente fila
    justifyContent: 'space-between', // Espacia los dos elementos a los lados
    width: '100%', 
    maxWidth: 400, 
    paddingHorizontal: 10, 
    marginBottom: 20,
    // gap: 8, <-- Si usaras gap, lo pondrías aquí, pero lo manejaremos en el margen del card
},
    
    // --- Botón Personalizado ---
    customGoalButton: {
        paddingVertical: 10, marginBottom: 30, borderWidth: 1, borderColor: COLORS.GRAY_BORDER, borderRadius: 8,
        width: '90%', maxWidth: 380, alignItems: 'center', backgroundColor: COLORS.GRAY_ACCENT,
    },
    customGoalButtonText: {
        color: COLORS.TEXT_PRIMARY, fontSize: 16, fontWeight: 'bold',
    },

    // --- Formulario ---
    formContainer: {
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    formSectionTitle: {
        fontSize: 18, fontWeight: 'bold', color: COLORS.TEXT_PRIMARY, marginBottom: 10, marginTop: 20,
    },
});