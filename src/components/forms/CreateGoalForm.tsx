import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch } from 'react-native';
import { FormProvider, useForm, Controller, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, Plus, Sun, Users } from 'lucide-react-native'; 

// 🚨 Importaciones de Componentes Modulares 🚨
import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { formComponentStyles } from '../../styles/GlobalStyles'; 
import { FormInput } from './formInput'; 
import { FormSelect, SelectOption } from './FormSelect';
import { FormDaySelector } from './FormDaySelector';
import { FormToggle } from './FormToggle';
import { Button } from '../ui/button'; 
import { GoalSchema, GoalFormType } from '../../schemas/createGoalSchema'; 
import { TARGET_TYPE_OPTIONS, TIME_OPTIONS } from '../../data/Options';
import { CATEGORIES } from '../../data/Categories';
import { FormDate } from './FormDate';
import DatePicker from 'react-native-date-picker';



interface GoalTemplate { id: string; title: string; description?: string | null; categoryId: string; targetType: 'DAILY' | 'WEEKLY' | number; targetValue?: number; }

// Lógica auxiliar para valores por defecto (basada en la plantilla)
const getFormDefaults = (template?: GoalTemplate): GoalFormType => {
    const targetType = template?.targetType || 'DAILY';
    return {
        name: template?.title || '', description: template?.description || '', categoryId: template?.categoryId || '',
        targetType: targetType, 
        startDate: new Date(), 
        // ✅ Asegura que el valor inicial sea null para el campo opcional
        endDate: null,
    } as GoalFormType;
};


interface CreateGoalFormProps {
    onCancel: () => void;
    methods: UseFormReturn<GoalFormType>;
    allCategories: any[];
    initialTemplate?: GoalTemplate; 
    onCreate: (data: GoalFormType) => void;
}

export function CreateGoalForm({ onCancel, allCategories, initialTemplate, methods, onCreate }: CreateGoalFormProps) {

  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)

    // 🚨 USAMOS LOS MÉTODOS PASADOS EN PROPS 🚨
    const { handleSubmit, control, watch, reset, register, unregister, setValue, formState: { isValid, isSubmitting } } = methods;

    // Determinar el estado inicial de la UI (Diaria o Personalizada)
    const isInitialCount = initialTemplate?.targetType === 'WEEKLY' || initialTemplate?.targetType === 'DAILY';
    const initialUiType: GoalTemplate['targetType'] = isInitialCount ? 'DAILY' : 'WEEKLY';
    const [uiGoalType, setUiGoalType] = useState<GoalTemplate['targetType']>(initialUiType);

    // Resetea el formulario cuando la plantilla inicial cambia
    useEffect(() => {
        const defaults = getFormDefaults(initialTemplate);
        reset(defaults);
        const newUiType: GoalTemplate['targetType'] = (initialTemplate?.targetType === 'WEEKLY' || initialTemplate?.targetType === 'DAILY') ? 'WEEKLY' : 'DAILY';
        setUiGoalType(newUiType);

    }, [initialTemplate, reset]);

    // Observamos los toggles y el valor de la UI
    const isSubmittingOrInvalid = isSubmitting || !isValid;
    const requiresQuantity = uiGoalType === 'WEEKLY';

    const onSubmit = (data: GoalFormType) => {
        // Mapeo final del targetType basado en la UI
        const targetTypeBE: 'DAILY' | 'WEEKLY' | string = uiGoalType === 'DAILY' ? 'DAILY' : 'COUNT';

        const finalPayload = {
            ...data,
            targetType: targetTypeBE, // 🚨 Sobreescribe con el valor correcto del BE
        };
        
        onCreate(finalPayload as GoalFormType);
    };

    return (
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                
                <Text style={styles.headerTitle}>Meta Personalizada</Text>
                
                <Text style={styles.headerSubtitle}>Ej: Meditar 10 minutos</Text>
                
                {/* 1. CAMPOS DE TEXTO PRINCIPALES */}
                <FormInput name="name" label="Nombre de la racha *" placeholder="Ej: Correr 5km diarios" />
                <FormInput name="description" label="Descripción" placeholder="Describe tu meta y por qué es importante para ti..." multiline={true} numberOfLines={4} customInputStyle={styles.descriptionInput} />

                {/* 2. CATEGORÍA (FormSelect) */}
                <Text style={styles.sectionLabel}>Categoría *</Text>
                <FormSelect name="categoryId" label=" " placeholder="Selecciona una categoría" options={CATEGORIES} />
                
                {/* 3. TIPO DE META (Radio Group tipo tarjeta - USA EL ESTADO LOCAL) */}
                <Text style={styles.sectionLabel}>Tipo de meta *</Text>
                <View style={styles.goalTypeGroup}>
                    {TARGET_TYPE_OPTIONS.map((option) => (
                        <TouchableOpacity 
                            key={option.value}
                            style={[styles.goalTypeCard, uiGoalType === option.value ? styles.goalTypeActive : null]}
                            onPress={() => {
                                setUiGoalType(option.value.toString() as GoalTemplate['targetType']);
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.goalTypeLabel, uiGoalType === option.value ? styles.goalTypeLabelActive : null]}>{option.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.datePickerWrapper}>
                        <FormDate
                            name="startDate"
                            label="Fecha de Inicio *"
                            placeholder="Selecciona la fecha de inicio"
                            minimumDate={new Date()} // 🚨 Restricción: No se permite el pasado
                        />
                    </View>

                <View style={styles.datePickerWrapper}>
                    <FormDate
                        name="endDate"
                        label="Fecha de Fin"
                        placeholder="Selecciona la fecha de fin"
                        minimumDate={new Date()} // 🚨 Restricción: No se permite el pasado
                    />
                </View>

                {/* --- 6. BOTONES DE ACCIÓN --- */}
                <View style={styles.buttonRow}>
                    <Button onPress={onCancel} style={styles.cancelButton} textStyle={styles.cancelButtonText} variant="outline" size="lg">
                        Cancelar
                    </Button>
                    <Button 
                        onPress={handleSubmit(onSubmit)} 
                        style={styles.createButton}
                        textStyle={styles.createButtonText}
                        variant="default" 
                        size="lg"
                        disabled={isSubmittingOrInvalid}
                        isLoading={isSubmittingOrInvalid}
                    >
                        <Text style={styles.createButtonText}>Crear Meta</Text>
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
}

// -------------------------------------------------------------
// 🚨 ESTILOS LOCALES 🚨 (Omitidos por brevedad, asume que están al final)
// -------------------------------------------------------------
const styles = StyleSheet.create({
    scrollContainer: { flex: 1, backgroundColor: COLORS.WHITE },
    container: { padding: 20, paddingBottom: 40, },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.TEXT_PRIMARY, textAlign: 'center', marginBottom: 4, },
    headerSubtitle: { fontSize: 16, color: COLORS.TEXT_MUTED, textAlign: 'center', marginBottom: 30, },
    descriptionInput: { minHeight: 100, textAlignVertical: 'top', paddingVertical: 10, },
    sectionLabel: { fontSize: 14, color: COLORS.TEXT_PRIMARY, marginTop: 20, marginBottom: 10, fontWeight: 'bold', },

    dateGroup: {
        flexDirection: 'row', 
        gap: 15, 
        marginTop: 10,
        marginBottom: 15,
    },
    datePickerWrapper: {
        flex: 1, // Para que ocupen la mitad del espacio cada uno
    },
    
    // --- Tipo de Meta (Botones de Tarjeta) ---
    goalTypeGroup: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 20, },
    goalTypeCard: { flex: 1, padding: 15, borderRadius: 12, backgroundColor: COLORS.BUTTON_SECONDARY_BG, borderWidth: 1, borderColor: COLORS.GRAY_BORDER, minHeight: 80, justifyContent: 'center', },
    goalTypeActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary, borderWidth: 2, },
    goalTypeLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.TEXT_PRIMARY, marginBottom: 4, },
    goalTypeSubtitle: { fontSize: 12, color: COLORS.TEXT_MUTED, },
    goalTypeLabelActive: { color: COLORS.WHITE, },
    
    // --- Cantidad/Unidad ---
    quantityUnitRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 10, alignItems: 'flex-start', },
    quantityWrapper: { flex: 1, },
    unitSelectWrapper: { flex: 1, },
    
    // --- Toggles y Hora ---
    toggleSection: { backgroundColor: COLORS.BUTTON_SECONDARY_BG, borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: COLORS.GRAY_BORDER, },
    reminderTimeContainer: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderColor: COLORS.GRAY_BORDER, },

    // --- Botones de Acción (Footer) ---
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, gap: 10, },
    cancelButton: { flex: 1, backgroundColor: COLORS.GRAY_ACCENT, paddingVertical: 14, borderRadius: 8, borderWidth: 1, borderColor: COLORS.GRAY_BORDER, },
    cancelButtonText: { color: COLORS.TEXT_PRIMARY, fontWeight: '600', textAlign: 'center', },
    createButton: { flex: 1, backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, },
    createButtonText: { color: COLORS.WHITE, fontWeight: 'bold', textAlign: 'center', },
});