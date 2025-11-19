import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Controller, useFormContext, FieldError } from 'react-hook-form';

// 🚨 Importa tus constantes de color y estilos 🚨
import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { formComponentStyles } from '../../styles/GlobalStyles'; 

// --- Interfaz de Datos para las Opciones ---
export interface RadioOption {
    label: string;
    value: string;
    subtitle?: string;
}

interface FormRadioButtonGroupProps {
    name: string;
    label: string;
    options: RadioOption[];
}

export function FormRadioButtonGroup({ name, label, options }: FormRadioButtonGroupProps) {
    const { control, formState: { errors } } = useFormContext();
    const error = errors[name] as FieldError | undefined;
    const hasError = !!error;

    return (
        <View style={styles.container}>
            
            {/* Label de la Sección */}
            <Text style={styles.sectionLabel}>{label}</Text>
            
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value } }) => (
                    <View style={styles.radioGroup}>
                        {options.map((option, index) => (
                            <TouchableOpacity 
                                key={option.value}
                                style={[
                                    styles.radioOption,
                                    hasError ? styles.radioOptionError : null,
                                    // Asegura que no haya borde inferior en el último elemento
                                    index === options.length - 1 ? styles.lastRadioOption : null 
                                ]}
                                onPress={() => onChange(option.value)}
                                activeOpacity={0.8}
                            >
                                {/* 🚨 Círculo Externo (Indicator) 🚨 */}
                                <View style={[
                                    styles.radioOuter,
                                    value === option.value ? styles.radioOuterActive : null
                                ]}>
                                    {value === option.value && <View style={styles.radioInner} />}
                                </View>
                                
                                {/* Texto de la Opción */}
                                <View style={styles.radioTextWrapper}>
                                    <Text style={styles.radioLabel}>{option.label}</Text>
                                    {option.subtitle && <Text style={styles.radioSubtitle}>{option.subtitle}</Text>}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            />
            
            {/* Mensaje de Error */}
            {hasError && <Text style={styles.errorText}>{error?.message}</Text>}
        </View>
    );
}

// -------------------------------------------------------------
// ESTILOS ESPECÍFICOS DEL RADIO GROUP
// -------------------------------------------------------------

const styles = StyleSheet.create({
    container: { marginBottom: 16 },
    sectionLabel: { 
        ...formComponentStyles.label, 
        marginTop: 20, 
        marginBottom: 10, 
        fontWeight: 'bold', // Sobreescribe si es necesario
    },

    // --- Grupo Contenedor ---
    radioGroup: {
        borderWidth: 1,
        borderColor: COLORS.GRAY_BORDER,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: COLORS.WHITE,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderColor: COLORS.GRAY_BORDER,
    },
    radioOptionError: {
        borderColor: COLORS.ERROR_TEXT,
    },
    lastRadioOption: {
        borderBottomWidth: 0, // Elimina el borde inferior del último item
    },

    // --- Indicator ---
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: COLORS.GRAY_BORDER,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioOuterActive: {
        borderColor: COLORS.primary, // Color primario al seleccionar
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.primary, // Círculo interno
    },

    // --- Texto ---
    radioTextWrapper: {
        marginLeft: 15,
    },
    radioLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.TEXT_PRIMARY,
    },
    radioSubtitle: {
        fontSize: 12,
        color: COLORS.TEXT_MUTED,
        marginTop: 2,
    },
    errorText: { 
        ...formComponentStyles.errorText, 
        marginTop: 4 
    },
});