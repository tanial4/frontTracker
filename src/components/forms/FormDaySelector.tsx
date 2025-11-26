import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Controller, useFormContext, FieldError } from 'react-hook-form';

import { BRAND_COLORS as COLORS } from '../../styles/Colors';

// Configuración estática de los días para iterar en la vista.
// Se define fuera del componente para evitar recrearlo en cada render.
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

// Componente para selección múltiple de días (ej: Lunes, Miércoles, Viernes).
// Funciona manipulando un array de strings dentro del formulario.
export function FormDaySelector({ name, label }: FormDaySelectorProps) {
    // Accedemos al contexto del formulario para no tener que pasar control/errors por props
    const { control, formState: { errors } } = useFormContext();
    const error = errors[name] as FieldError | undefined;

    return (
        <View style={styles.container}>
            
            <Text style={styles.sectionLabel}>{label}</Text>
            
            <Controller
                control={control}
                name={name}
                // Importante: Inicializamos con array vacío para evitar errores de null/undefined al usar .includes()
                defaultValue={[]} 
                render={({ field: { onChange, value } }) => {
                    // Garantizamos que siempre trabajamos con un array
                    const selectedDays: string[] = Array.isArray(value) ? value : [];

                    // Lógica para alternar la selección de un día
                    const toggleDay = (dayValue: string) => {
                        const isCurrentlySelected = selectedDays.includes(dayValue);
                        
                        // Si ya está seleccionado, lo filtramos (quitamos).
                        // Si no, desestructuramos el array actual y agregamos el nuevo valor.
                        const newDays = isCurrentlySelected
                            ? selectedDays.filter((d) => d !== dayValue)
                            : [...selectedDays, dayValue];
                            
                        onChange(newDays);
                    };

                    return (
                        <>
                            {/* Renderizado de los botones circulares/cuadrados */}
                            <View style={styles.daySelectorRow}>
                                {DAYS_OF_WEEK.map((day) => {
                                    const isSelected = selectedDays.includes(day.value);
                                    return (
                                        <TouchableOpacity
                                            key={day.value}
                                            style={[
                                                styles.dayButton,
                                                isSelected ? styles.dayButtonActive : null,
                                                // Feedback visual: borde rojo si hay error de validación (ej: campo requerido)
                                                error && styles.dayButtonError 
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
                            
                            {/* Feedback textual al usuario sobre cuántos días ha marcado */}
                            <Text style={styles.selectedDaysCount}>
                                {selectedDays.length} días seleccionado{selectedDays.length !== 1 ? 's' : ''}
                            </Text>
                        </>
                    );
                }}
            />
            
            {/* Mensaje de error (ej: "Debes seleccionar al menos un día") */}
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
    
    // Contenedor flexible para distribuir los 7 días
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
        borderColor: COLORS.BORDER_COLOR,
        backgroundColor: COLORS.BACKGROUND_DEFAULT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayButtonActive: {
        backgroundColor: COLORS.PRIMARY,
        borderColor: COLORS.PRIMARY,
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
        color: COLORS.BACKGROUND_DEFAULT,
    },

    // Textos auxiliares
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