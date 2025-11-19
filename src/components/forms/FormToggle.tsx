import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Controller, useFormContext, FieldError } from 'react-hook-form';

// 🚨 Importa tus constantes de color y estilos 🚨
// NOTA: Asegúrate de que COLORS y formComponentStyles estén bien importados
import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { formComponentStyles } from '../../styles/GlobalStyles'; 

interface FormToggleProps {
    name: string;
    label: string;
    subtitle: string;
    leftIcon?: React.ReactNode; // 🚨 NUEVA PROP: Un nodo React para el ícono
}

export function FormToggle({ name, label, subtitle, leftIcon }: FormToggleProps) {
    const { control, formState: { errors } } = useFormContext();
    const error = errors[name] as FieldError | undefined; 
    
    const trackColor = { 
        false: COLORS.GRAY_ACCENT || '#E5E5E5',
        true: COLORS.primary || '#7c3aed'
    };

    return (
        <View style={styles.toggleSection}>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value } }) => (
                    <View style={styles.toggleRow}>
                        
                        {/* 🚨 Ícono a la izquierda (condicional) 🚨 */}
                        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

                        {/* Texto Descriptivo */}
                        <View style={styles.textWrapper}>
                            <Text style={styles.toggleLabel}>{label}</Text>
                            <Text style={styles.toggleSubtitle}>{subtitle}</Text>
                        </View>
                        
                        {/* Control del Switch */}
                        <Switch
                            onValueChange={onChange}
                            value={value}
                            trackColor={trackColor}
                            thumbColor={COLORS.WHITE} 
                        />
                    </View>
                )}
            />
            
            {error?.message && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
    );
}

// -------------------------------------------------------------
// ESTILOS ESPECÍFICOS DEL TOGGLE (Ajustados para el ícono)
// -------------------------------------------------------------

const styles = StyleSheet.create({
    toggleSection: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 15, // Mantén un padding para el contenido
        marginBottom: 15,
        borderWidth: 1,
        borderColor: COLORS.GRAY_BORDER,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center', // Asegura que todo esté alineado verticalmente
        justifyContent: 'space-between',
    },
    // 🚨 NUEVO CONTENEDOR PARA EL ÍCONO IZQUIERDO 🚨
    leftIconContainer: {
        marginRight: 15, // Espacio entre el ícono y el texto
        // Puedes añadir un padding o tamaño fijo si los iconos varían
    },
    textWrapper: {
        flex: 1, // Permite que el texto ocupe el espacio disponible
        marginRight: 10, // Espacio entre el texto y el switch
    },
    toggleLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.TEXT_PRIMARY,
    },
    toggleSubtitle: {
        fontSize: 12,
        color: COLORS.TEXT_MUTED,
        marginTop: 2,
    },
    errorText: {
        ...formComponentStyles.errorText,
        marginTop: 5,
    }
});