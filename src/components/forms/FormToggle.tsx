import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Controller, useFormContext, FieldError } from 'react-hook-form';

import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { formComponentStyles } from '../../styles/GlobalStyles'; 

interface FormToggleProps {
    name: string;
    label: string;
    subtitle: string;
    // Elemento gráfico opcional a la izquierda (ej: campana de notificaciones o icono de privacidad)
    leftIcon?: React.ReactNode; 
}

// Componente tipo "Interruptor" (Switch) conectado a React Hook Form.
// Se presenta dentro de una tarjeta con borde, ideal para configuraciones o preferencias.
export function FormToggle({ name, label, subtitle, leftIcon }: FormToggleProps) {
    // Accedemos al contexto del formulario
    const { control, formState: { errors } } = useFormContext();
    const error = errors[name] as FieldError | undefined; 
    
    // Configuración de colores para los estados inactivo (false) y activo (true).
    // Se usan fallbacks hexadecimales por seguridad si las constantes de color fallan.
    const trackColor = { 
        false: COLORS.ACCENT || '#E5E5E5',
        true: COLORS.PRIMARY || '#7c3aed'
    };

    return (
        <View style={styles.toggleSection}>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value } }) => (
                    <View style={styles.toggleRow}>
                        
                        {/* Renderizado condicional del icono. Si no se pasa la prop, no ocupa espacio. */}
                        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

                        {/* Contenedor de texto flexible */}
                        <View style={styles.textWrapper}>
                            <Text style={styles.toggleLabel}>{label}</Text>
                            <Text style={styles.toggleSubtitle}>{subtitle}</Text>
                        </View>
                        
                        {/* Switch nativo */}
                        <Switch
                            onValueChange={onChange}
                            value={value}
                            trackColor={trackColor}
                            // El color del "pulgar" (círculo) se mantiene consistente con el fondo
                            thumbColor={COLORS.BACKGROUND_DEFAULT} 
                        />
                    </View>
                )}
            />
            
            {/* Mensaje de error (aunque es raro en toggles, puede ocurrir si hay validación custom) */}
            {error?.message && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
    );
}

// -------------------------------------------------------------
// ESTILOS
// -------------------------------------------------------------

const styles = StyleSheet.create({
    toggleSection: {
        backgroundColor: COLORS.BACKGROUND_DEFAULT,
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: COLORS.BORDER_COLOR,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center', // Centrado vertical de icono, texto y switch
        justifyContent: 'space-between',
    },
    leftIconContainer: {
        marginRight: 15, // Separación consistente con el texto
    },
    textWrapper: {
        flex: 1, // Permite que el texto ocupe todo el espacio disponible entre el icono y el switch
        marginRight: 10,
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