import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Controller, useFormContext, FieldError } from 'react-hook-form';
import DatePicker from 'react-native-date-picker';
import { Calendar } from 'lucide-react-native';

import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { formComponentStyles } from '../../styles/GlobalStyles'; 

// Helper para dar formato legible a la fecha en la interfaz (ej: "18 nov. 2025").
// Se usa la configuración local de México.
const formatDate = (date: Date): string => {
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
    // Fecha mínima seleccionable (útil para evitar fechas pasadas en metas nuevas)
    minimumDate?: Date; 
}

// Componente wrapper para integrar el DatePicker nativo con React Hook Form.
// Funciona simulando un input de texto que al presionarse abre el modal de fecha.
export function FormDate({ name, label, placeholder, minimumDate }: FormDateProps) {
    // Usamos useFormContext para acceder al control sin pasar props manualmente desde el padre
    const { control, formState: { errors } } = useFormContext();
    const error = errors[name] as FieldError | undefined;
    const hasError = !!error;

    // Controla la visibilidad del modal nativo
    const [open, setOpen] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value } }) => {
                    
                    // Lógica de seguridad: La librería DatePicker falla si la propiedad 'date' es null o undefined.
                    // Si el valor del formulario está vacío, usamos la fecha actual (new Date) 
                    // solo para inicializar visualmente el picker donde debe empezar.
                    const selectedDate = value instanceof Date ? value : new Date();
                    
                    // Decidimos qué texto mostrar: la fecha formateada o el placeholder
                    const displayValue = value instanceof Date ? formatDate(value) : placeholder;

                    return (
                        <>
                            {/* Input visual (TouchableOpacity) */}
                            <TouchableOpacity
                                style={[styles.inputWrapper, hasError ? styles.inputError : null]}
                                onPress={() => setOpen(true)}
                                activeOpacity={0.7}
                            >
                                <Calendar size={20} color={COLORS.TEXT_MUTED} style={styles.icon} />
                                <Text style={[styles.inputText, !value && styles.placeholderText]}>
                                    {displayValue}
                                </Text>
                            </TouchableOpacity>

                            {/* Componente Modal (Invisible hasta que open es true) */}
                            <DatePicker
                                modal
                                open={open}
                                date={selectedDate}
                                mode="date"
                                minimumDate={minimumDate}
                                
                                // Solo actualizamos el estado del formulario cuando el usuario confirma explícitamente.
                                onConfirm={(date) => {
                                    setOpen(false);
                                    onChange(date);
                                    console.log("Fecha seleccionada:", date);
                                }}
                                
                                onCancel={() => {
                                    setOpen(false);
                                }}
                            />
                        </>
                    );
                }}
            />

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
        flexDirection: 'row', 
        alignItems: 'center', 
        height: 48, 
        borderWidth: 1,
        borderColor: COLORS.BORDER_COLOR, 
        backgroundColor: COLORS.INPUT_BACKGROUND,
        borderRadius: 8, 
        paddingHorizontal: 12,
    },
    inputError: { borderColor: COLORS.ERROR_TEXT },
    icon: { marginRight: 10 },
    inputText: { fontSize: 16, color: COLORS.TEXT_PRIMARY, flex: 1 },
    placeholderText: { color: COLORS.TEXT_MUTED },
    errorText: { ...formComponentStyles.errorText, marginTop: 4 },
});