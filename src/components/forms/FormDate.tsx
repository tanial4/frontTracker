import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Controller, useFormContext, FieldError } from 'react-hook-form';
import DatePicker from 'react-native-date-picker'; // 🚨 Librería moderna
import { Calendar } from 'lucide-react-native';

// 🚨 Importa tus constantes de color y estilos 🚨
import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { formComponentStyles } from '../../styles/GlobalStyles'; 

// Función auxiliar para formatear la fecha a un string legible
const formatDate = (date: Date): string => {
    // Retorna una cadena de fecha localizada (Ej: "Nov. 18, 2025")
    return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

interface FormDateProps {
    name: string;
    label: string;
    placeholder: string;
    // La prop minimumDate es un objeto Date opcional
    minimumDate?: Date; 
}

export function FormDate({ name, label, placeholder, minimumDate }: FormDateProps) {
    const { control, formState: { errors } } = useFormContext();
    const error = errors[name] as FieldError | undefined;
    const hasError = !!error;

    // Estado local para controlar la visibilidad del modal del DatePicker
    const [open, setOpen] = useState(false);

    return (
        <View style={styles.container}>
            {/* Label */}
            <Text style={styles.label}>{label}</Text>

            <Controller
                control={control}
                name={name}
                // Si el valor inicial es null/undefined, RHF lo pasa como tal.
                render={({ field: { onChange, value } }) => {
                    
                    // 🚨 FIX: Garantizamos que selectedDate sea un objeto Date válido para el Picker 🚨
                    // Si value es Date, úsala; si no, usa una nueva fecha para evitar el crash.
                    const selectedDate = value instanceof Date ? value : new Date();
                    
                    // Solo mostramos el valor formateado si value existe y es una Date
                    const displayValue = value instanceof Date ? formatDate(value) : placeholder;

                    return (
                        <>
                            {/* 1. Input Simulado (TouchableOpacity) */}
                            <TouchableOpacity
                                style={[styles.inputWrapper, hasError ? styles.inputError : null]}
                                onPress={() => setOpen(true)} // Abre el Modal
                                activeOpacity={0.7}
                            >
                                <Calendar size={20} color={COLORS.TEXT_MUTED} style={styles.icon} />
                                <Text style={[styles.inputText, !value && styles.placeholderText]}>
                                    {displayValue}
                                </Text>
                            </TouchableOpacity>

                            {/* 2. DatePicker Modal */}
                            <DatePicker
                                modal
                                open={open}
                                date={selectedDate} // 🚨 Usamos la variable garantizada 🚨
                                mode="date"
                                minimumDate={minimumDate}
                                
                                // Evento al seleccionar la fecha (Guardar y Cerrar)
                                onConfirm={(date) => {
                                    setOpen(false);
                                    onChange(date); // 🚨 Pasa el objeto Date a RHF
                                    console.log("Fecha seleccionada:", date);
                                }}
                                
                                // Evento al Cancelar (Cerrar el Modal)
                                onCancel={() => {
                                    setOpen(false);
                                }}
                            />
                        </>
                    );
                }}
            />

            {/* Mensaje de Error */}
            {hasError && <Text style={styles.errorText}>{error?.message}</Text>}
        </View>
    );
}

// -------------------------------------------------------------
// ESTILOS ESPECÍFICOS PARA EL SELECTOR DE FECHA
// -------------------------------------------------------------

const styles = StyleSheet.create({
    container: { marginBottom: 16 },
    label: { ...formComponentStyles.label, marginBottom: 8 },
    inputWrapper: {
        flexDirection: 'row', alignItems: 'center', height: 48, borderWidth: 1,
        borderColor: COLORS.GRAY_BORDER, backgroundColor: COLORS.INPUT_BG,
        borderRadius: 8, paddingHorizontal: 12,
    },
    inputError: { borderColor: COLORS.ERROR_TEXT },
    icon: { marginRight: 10 },
    inputText: { fontSize: 16, color: COLORS.TEXT_PRIMARY, flex: 1 },
    placeholderText: { color: COLORS.TEXT_MUTED },
    errorText: { ...formComponentStyles.errorText, marginTop: 4 },
});