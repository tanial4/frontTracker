import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Controller, useFormContext, FieldError } from 'react-hook-form';

import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { formComponentStyles } from '../../styles/GlobalStyles'; 

// Estructura de datos para cada opción seleccionable.
// El subtítulo es opcional y sirve para dar contexto extra (ej: "Envío Express - Llega mañana").
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

// Componente de selección única (Radio Button) integrado con React Hook Form.
// Renderiza una lista vertical estilizada donde solo se puede elegir una opción.
export function FormRadioButtonGroup({ name, label, options }: FormRadioButtonGroupProps) {
    // Obtenemos el contexto del formulario para manejar el estado y errores sin pasar props manualmente
    const { control, formState: { errors } } = useFormContext();
    const error = errors[name] as FieldError | undefined;
    const hasError = !!error;

    return (
        <View style={styles.container}>
            
            {/* Título de la sección de opciones */}
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
                                    // Lógica visual: Si es el último elemento, quitamos el borde inferior
                                    // para que no choque con el borde del contenedor redondeado.
                                    index === options.length - 1 ? styles.lastRadioOption : null 
                                ]}
                                onPress={() => onChange(option.value)}
                                activeOpacity={0.8}
                            >
                                {/* Indicador visual del Radio Button (Círculo) */}
                                <View style={[
                                    styles.radioOuter,
                                    value === option.value ? styles.radioOuterActive : null
                                ]}>
                                    {/* Renderizado condicional del punto interno si está seleccionado */}
                                    {value === option.value && <View style={styles.radioInner} />}
                                </View>
                                
                                {/* Textos de la opción (Título y Subtítulo) */}
                                <View style={styles.radioTextWrapper}>
                                    <Text style={styles.radioLabel}>{option.label}</Text>
                                    {option.subtitle && <Text style={styles.radioSubtitle}>{option.subtitle}</Text>}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            />
            
            {/* Mensaje de error de validación */}
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
        fontWeight: 'bold', 
    },

    // Contenedor principal de la lista
    radioGroup: {
        borderWidth: 1,
        borderColor: COLORS.BORDER_COLOR,
        borderRadius: 10,
        overflow: 'hidden', // Asegura que los hijos no se salgan de los bordes redondeados
        backgroundColor: COLORS.BACKGROUND_DEFAULT,
    },
    // Estilo de cada fila
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1, // Separador entre opciones
        borderColor: COLORS.BORDER_COLOR,
    },
    radioOptionError: {
        borderColor: COLORS.ERROR_TEXT,
    },
    lastRadioOption: {
        borderBottomWidth: 0, // Importante para la estética del último ítem
    },

    // Estilos del indicador circular
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: COLORS.BORDER_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioOuterActive: {
        borderColor: COLORS.PRIMARY,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.PRIMARY,
    },

    // Estilos de texto
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