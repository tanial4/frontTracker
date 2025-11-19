// src/components/forms/FormSelectElement.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller, useFormContext, FieldError } from 'react-hook-form';
import { Dropdown } from 'react-native-element-dropdown'; // 🚨 La librería
import { ChevronDown, ChevronUp } from 'lucide-react-native';

// 🚨 Importa tus constantes de color y estilos 🚨
import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { formComponentStyles } from '../../styles/GlobalStyles'; 

export interface SelectOption {
    label: string;
    value: string;
}

interface FormSelectElementProps {
    name: string;
    label: string;
    placeholder: string;
    options: SelectOption[];
    
    // Opcional para accesibilidad y estilo
    search?: boolean;
}

export function FormSelect({ name, label, placeholder, options, search = false }: FormSelectElementProps) {
    const { control, formState: { errors } } = useFormContext();
    const error = errors[name] as FieldError | undefined;
    const hasError = !!error;

    return (
        <View style={styles.container}>
            
            {/* Label */}
            <Text style={styles.label}>{label}</Text>
            
            <Controller
                control={control}
                name={name}
                defaultValue={placeholder} // El valor inicial puede ser el placeholder si el campo es opcional
                render={({ field: { onChange, value } }) => (
                    <Dropdown
                        // Datos y Manejo de Eventos (Binding RHF)
                        data={options}
                        value={value}
                        onChange={item => onChange(item.value)} // 🚨 CRÍTICO: Pasa solo el 'value' a RHF
                        
                        // Configuración Visual
                        placeholder={placeholder}
                        search={search}
                        labelField="label"
                        valueField="value"
                        
                        // Estilos
                        style={[styles.dropdown, hasError && styles.dropdownError]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        
                        // Íconos
                        renderRightIcon={() => (
                            <ChevronDown size={20} color={COLORS.TEXT_MUTED} />
                        )}
                    />
                )}
            />
            
            {/* Mensaje de Error */}
            {hasError && <Text style={styles.errorText}>{error?.message}</Text>}
        </View>
    );
}

// -------------------------------------------------------------
// ESTILOS (Alineados con el diseño de tus FormInputs)
// -------------------------------------------------------------

const styles = StyleSheet.create({
    container: { marginBottom: 16 },
    label: { 
        ...formComponentStyles.label, 
        marginBottom: 8 
    },
    dropdown: {
        height: 48,
        borderWidth: 1,
        borderColor: COLORS.GRAY_BORDER,
        backgroundColor: COLORS.INPUT_BG,
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    dropdownError: {
        borderColor: COLORS.ERROR_TEXT,
    },
    placeholderStyle: {
        fontSize: 16,
        color: COLORS.TEXT_MUTED,
    },
    selectedTextStyle: {
        fontSize: 16,
        color: COLORS.TEXT_PRIMARY,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    errorText: { 
        ...formComponentStyles.errorText, 
        marginTop: 4 
    },
});