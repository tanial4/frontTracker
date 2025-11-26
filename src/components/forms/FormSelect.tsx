import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller, useFormContext, FieldError } from 'react-hook-form';
import { Dropdown } from 'react-native-element-dropdown'; 
import { ChevronDown } from 'lucide-react-native';

import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { formComponentStyles } from '../../styles/GlobalStyles'; 

// Estructura estándar para poblar las opciones del menú.
export interface SelectOption {
    label: string;
    value: string;
}

interface FormSelectElementProps {
    name: string;
    label: string;
    placeholder: string;
    options: SelectOption[];
    
    // Habilita una barra de búsqueda dentro del dropdown (útil para listas largas)
    search?: boolean;
}

// Componente wrapper para 'react-native-element-dropdown' conectado al contexto del formulario.
export function FormSelect({ name, label, placeholder, options, search = false }: FormSelectElementProps) {
    // Usamos useFormContext para evitar prop-drilling de 'control' y 'errors'
    const { control, formState: { errors } } = useFormContext();
    const error = errors[name] as FieldError | undefined;
    const hasError = !!error;

    return (
        <View style={styles.container}>
            
            <Text style={styles.label}>{label}</Text>
            
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value } }) => (
                    <Dropdown
                        // Configuración de datos
                        data={options}
                        value={value}
                        
                        // Lógica de actualización:
                        // La librería devuelve el objeto completo (item: { label, value }), 
                        // pero al formulario solo le interesa guardar el 'value' primitivo.
                        onChange={item => onChange(item.value)}
                        
                        // Configuración visual y textos
                        placeholder={placeholder}
                        search={search}
                        labelField="label"
                        valueField="value"
                        searchPlaceholder="Buscar..."
                        
                        // Estilos condicionales (normal vs error)
                        style={[styles.dropdown, hasError && styles.dropdownError]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        
                        // Personalización del icono de flecha
                        renderRightIcon={() => (
                            <ChevronDown size={20} color={COLORS.TEXT_MUTED} />
                        )}
                    />
                )}
            />
            
            {/* Mensaje de error al pie del componente */}
            {hasError && <Text style={styles.errorText}>{error?.message}</Text>}
        </View>
    );
}

// -------------------------------------------------------------
// ESTILOS
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
        borderColor: COLORS.BORDER_COLOR,
        backgroundColor: COLORS.INPUT_BACKGROUND,
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
        color: COLORS.TEXT_PRIMARY,
    },
    errorText: { 
        ...formComponentStyles.errorText, 
        marginTop: 4 
    },
});