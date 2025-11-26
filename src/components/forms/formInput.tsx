import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, TouchableOpacity, ViewStyle } from 'react-native';
import { useController, useFormContext, FieldError } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react-native';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';

interface FormInputProps extends TextInputProps {
    name: string;
    label: string;
    isPassword?: boolean;
    isInvalid?: boolean;
    // Elemento opcional para renderizar a la derecha (ej: un icono de búsqueda o unidad de medida)
    rightIcon?: React.ReactNode;
    
    // Props específicas para controlar el comportamiento de área de texto (textarea)
    multiline?: boolean;
    numberOfLines?: number;
    // Permite sobrescribir estilos desde el padre, útil para alturas personalizadas
    customInputStyle?: ViewStyle | ViewStyle[]; 
}

// Componente wrapper reutilizable que conecta un TextInput nativo con React Hook Form.
// Soporta modos de contraseña, validación de errores y estilos multilínea.
export function FormInput({ 
    name, 
    label, 
    isPassword = false, 
    isInvalid, 
    rightIcon, 
    multiline = false, 
    numberOfLines = 1, 
    customInputStyle, 
    ...props 
}: FormInputProps) {
    // Usamos useFormContext para acceder al estado del formulario sin pasar props manualmente
    const { control, formState: { errors } } = useFormContext();
    
    // useController nos da control granular sobre el input (value, onBlur, onChange)
    const { field } = useController({ name, control });
    
    // Estado local para alternar la visibilidad de la contraseña
    const [secureTextEntry, setSecureTextEntry] = useState(isPassword);
    
    const hasError = errors[name] || isInvalid; 
    const error = errors[name] as FieldError | undefined;

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    // Composición de estilos:
    // 1. Estilo base.
    // 2. Estilo de error (borde rojo) si falla la validación.
    // 3. Estilo multilínea (altura dinámica) si es textarea.
    // 4. Estilos personalizados inyectados por props.
    const inputStyleArray = [
        inputStyles.input, 
        hasError ? inputStyles.inputError : null,
        multiline ? inputStyles.multilineInput : null, 
        customInputStyle 
    ];

    return (
        <View style={inputStyles.container}>
            <Text style={inputStyles.label}>{label}</Text>
            
            <View style={inputStyles.inputWrapper}>
                <TextInput
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    
                    multiline={multiline}
                    numberOfLines={multiline ? numberOfLines : undefined}
                    
                    // Importante: textAlignVertical 'top' es necesario en Android para que el texto
                    // empiece en la esquina superior izquierda en inputs de varias líneas,
                    // de lo contrario empieza centrado verticalmente.
                    textAlignVertical={multiline ? 'top' : 'center'}
                    
                    style={inputStyleArray}
                    placeholderTextColor={COLORS.TEXT_MUTED}
                    secureTextEntry={secureTextEntry}
                    {...props}
                />
                
                {/* Botón para alternar visibilidad de contraseña */}
                {isPassword && (
                    <TouchableOpacity onPress={toggleSecureEntry} style={inputStyles.passwordToggle}>
                        {secureTextEntry ? (
                            <EyeOff size={20} color={COLORS.TEXT_MUTED} />
                        ) : (
                            <Eye size={20} color={COLORS.TEXT_MUTED} />
                        )}
                    </TouchableOpacity>
                )}
                
                {/* Icono derecho genérico (solo se muestra si no es un campo de contraseña) */}
                {!isPassword && rightIcon && (
                    <View style={inputStyles.rightIconContainer}>
                        {rightIcon}
                    </View>
                )}
            </View>

            {/* Mensaje de error al pie del input */}
            {error?.message && <Text style={inputStyles.errorText}>{error.message}</Text>}
        </View>
    );
}

// -------------------------------------------------------------
// ESTILOS Y COLORES
// -------------------------------------------------------------

const inputStyles = StyleSheet.create({
    container: { marginBottom: 16 },
    label: { 
        fontSize: 14, 
        color: COLORS.TEXT_PRIMARY, 
        marginBottom: 8, 
        fontWeight: '500' 
    },
    inputWrapper: { 
        flexDirection: 'row', 
        // 'flex-start' es necesario para que, en multilínea, los iconos se queden arriba
        // y no se centren respecto a la altura total del input.
        alignItems: 'flex-start', 
        position: 'relative' 
    },
    input: {
        flex: 1, 
        height: 48, // Altura estándar para inputs de una línea
        borderWidth: 1, 
        borderColor: COLORS.BORDER_COLOR,
        backgroundColor: COLORS.INPUT_BACKGROUND,
        borderRadius: 8, 
        paddingHorizontal: 12,
        // Padding vertical necesario para centrar visualmente el texto en algunos dispositivos
        paddingVertical: 12, 
        fontSize: 16, 
        color: COLORS.TEXT_PRIMARY,
    },
    // Estilos específicos para modo Textarea
    multilineInput: {
        minHeight: 100, 
        height: 'auto', // Permite crecer si fuera necesario (aunque limitado por numberOfLines visualmente)
        paddingTop: 12, 
        paddingBottom: 12,
        backgroundColor: COLORS.INPUT_BACKGROUND,
        color: COLORS.TEXT_PRIMARY,
    },
    inputError: { borderColor: COLORS.ERROR_TEXT },
    errorText: { color: COLORS.ERROR_TEXT, fontSize: 12, marginTop: 4 },
    
    // Posicionamiento absoluto para iconos dentro del input
    passwordToggle: { 
        position: 'absolute', 
        right: 12, 
        top: 0, 
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
    },
    rightIconContainer: {
        position: 'absolute', 
        right: 12, 
        top: 0, 
        bottom: 0, 
        alignItems: 'center',
        justifyContent: 'center',
    }
});