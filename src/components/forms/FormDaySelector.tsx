import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Controller, useFormContext, FieldError } from 'react-hook-form';

// 🚨 Importa tus constantes de color y estilos 🚨
// NOTA: Asume que COLORS está disponible en este scope
// import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { formComponentStyles } from '../../styles/GlobalStyles';

// --- Datos Fijos de la Semana ---
const DAYS_OF_WEEK = [
    { label: 'L', value: 'L' },
    { label: 'M', value: 'M' },
    { label: 'X', value: 'X' },
    { label: 'J', value: 'J' },
    { label: 'V', value: 'V' },
    { label: 'S', value: 'S' },
    { label: 'D', value: 'D' },
];

interface FormDaySelectorProps {
    name: string;
    label: string;
}

export function FormDaySelector({ name, label }: FormDaySelectorProps) {
    const { control, formState: { errors } } = useFormContext();
    const error = errors[name] as FieldError | undefined;

    return (
        <View style={styles.container}>
            
            {/* 1. Label de la Sección */}
            <Text style={styles.sectionLabel}>{label}</Text>
            
            <Controller
                control={control}
                name={name}
                // Asegura que el valor inicial sea un array vacío si no está definido
                defaultValue={[]} 
                render={({ field: { onChange, value } }) => {
                    const selectedDays: string[] = Array.isArray(value) ? value : [];

                    const toggleDay = (dayValue: string) => {
                        const isCurrentlySelected = selectedDays.includes(dayValue);
                        
                        // Lógica para agregar o eliminar el día del array
                        const newDays = isCurrentlySelected
                            ? selectedDays.filter((d) => d !== dayValue)
                            : [...selectedDays, dayValue];
                            
                        onChange(newDays); // Actualiza el valor en react-hook-form
                    };

                    return (
                        <>
                            {/* 2. Botones de Selección */}
                            <View style={styles.daySelectorRow}>
                                {DAYS_OF_WEEK.map((day) => {
                                    const isSelected = selectedDays.includes(day.value);
                                    return (
                                        <TouchableOpacity
                                            key={day.value}
                                            style={[
                                                styles.dayButton,
                                                isSelected ? styles.dayButtonActive : null,
                                                error && styles.dayButtonError // Borde rojo en caso de error
                                            ]}
                                            onPress={() => toggleDay(day.value)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[
                                                styles.dayButtonText,
                                                isSelected ? styles.dayButtonTextActive : null,
                                            ]}>
                                                {day.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                                </View>
                                
                                {/* 3. Contador de Días Seleccionados */}
                                <Text style={styles.selectedDaysCount}>
                                    {selectedDays.length} días seleccionado{selectedDays.length !== 1 ? 's' : ''}
                                </Text>
                            </>
                        );
                    }}
                />
            
            {/* Mensaje de Error (si es necesario) */}
            {error?.message && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
    );
}

// -------------------------------------------------------------
// ESTILOS ESPECÍFICOS DEL SELECTOR DE DÍAS
// -------------------------------------------------------------

const styles = StyleSheet.create({
    container: { marginBottom: 16 },
    sectionLabel: { 
        fontSize: 14,
        color: COLORS.TEXT_PRIMARY,
        marginTop: 20, 
        marginBottom: 10, 
        fontWeight: 'bold',
    },
    
    // --- Fila de Botones ---
    daySelectorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
    },
    dayButton: {
        width: 40, 
        height: 40,
        borderRadius: 10, 
        borderWidth: 1,
        borderColor: COLORS.GRAY_BORDER,
        backgroundColor: COLORS.WHITE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayButtonActive: {
        backgroundColor: COLORS.primary, // Púrpura (Color de marca)
        borderColor: COLORS.primary,
    },
    dayButtonError: {
        borderColor: COLORS.ERROR_TEXT,
    },
    dayButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.TEXT_PRIMARY,
    },
    dayButtonTextActive: {
        color: COLORS.WHITE,
    },

    // --- Contador y Error ---
    selectedDaysCount: {
        fontSize: 13,
        color: COLORS.TEXT_MUTED,
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 20,
    },
    errorText: {
        color: COLORS.ERROR_TEXT,
        fontSize: 12,
        textAlign: 'center', 
        marginTop: 5,
    },
});