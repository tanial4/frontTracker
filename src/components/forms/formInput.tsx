import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, TouchableOpacity, ViewStyle } from 'react-native';
import { useController, useFormContext, FieldError } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react-native';

interface FormInputProps extends TextInputProps {
    name: string;
    label: string;
    isPassword?: boolean;
    isInvalid?: boolean;
    rightIcon?: React.ReactNode;
    
    // 🚨 NUEVA PROP PARA TEXTAREA 🚨
    multiline?: boolean;
    numberOfLines?: number;
    customInputStyle?: ViewStyle | ViewStyle[]; // Para estilos específicos de textarea
}

export function FormInput({ name, label, isPassword = false, isInvalid, rightIcon, multiline = false, numberOfLines = 1, customInputStyle, ...props }: FormInputProps) {
    const { control, formState: { errors } } = useFormContext();
    const { field } = useController({ name, control });
    const [secureTextEntry, setSecureTextEntry] = useState(isPassword);
    
    const hasError = errors[name] || isInvalid; 
    const error = errors[name] as FieldError | undefined;

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    // 🚨 Lógica para ajustar el estilo del Input 🚨
    const inputStyleArray = [
        inputStyles.input, 
        hasError ? inputStyles.inputError : null,
        // 🛠️ Si es multiline, aplica el estilo específico para alineación 🛠️
        multiline ? inputStyles.multilineInput : null, 
        customInputStyle // Para permitir sobrescribir la altura
    ];

    return (
        <View style={inputStyles.container}>
            {/* Label */}
            <Text style={inputStyles.label}>{label}</Text>
            
            <View style={inputStyles.inputWrapper}>
                <TextInput
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    
                    // 🚨 PROPS DE TEXTAREA 🚨
                    multiline={multiline}
                    numberOfLines={multiline ? numberOfLines : undefined}
                    textAlignVertical={multiline ? 'top' : 'center'} // CRÍTICO para Android
                    
                    style={inputStyleArray}
                    placeholderTextColor={COLORS.textMuted}
                    secureTextEntry={secureTextEntry}
                    {...props}
                />
                
                {isPassword && (
                    <TouchableOpacity onPress={toggleSecureEntry} style={inputStyles.passwordToggle}>
                        {secureTextEntry ? (
                            <EyeOff size={20} color={COLORS.textMuted} />
                        ) : (
                            <Eye size={20} color={COLORS.textMuted} />
                        )}
                    </TouchableOpacity>
                )}
                
                {/* 🛠️ Soporte para el ícono derecho general (si no es contraseña) 🛠️ */}
                {!isPassword && rightIcon && (
                    <View style={inputStyles.rightIconContainer}>
                        {rightIcon}
                    </View>
                )}
            </View>

            {error?.message && <Text style={inputStyles.errorText}>{error.message}</Text>}
        </View>
    );
}

// -------------------------------------------------------------
// ESTILOS Y COLORES (Ajustados para el nuevo Input)
// -------------------------------------------------------------

const COLORS = {
    // ... Colores deben ser importados de Colors.ts en una aplicación real
    inputBorder: '#e5e7eb', 
    inputBackground: '#f9fafb', 
    textPrimary: '#000000',
    textMuted: '#717182',
    errorText: '#d4183d',
    errorBorder: '#d4183d',
};

const inputStyles = StyleSheet.create({
    container: { marginBottom: 16 },
    label: { fontSize: 14, color: COLORS.textPrimary, marginBottom: 8, fontWeight: '500' },
    inputWrapper: { 
        flexDirection: 'row', 
        alignItems: 'flex-start', // Alineamos al inicio para el textarea
        position: 'relative' 
    },
    input: {
        flex: 1, 
        height: 48, // Altura estándar
        borderWidth: 1, 
        borderColor: COLORS.inputBorder,
        backgroundColor: COLORS.inputBackground,
        borderRadius: 8, 
        paddingHorizontal: 12,
        paddingVertical: 12, // Ajustar el padding vertical para centrar el texto
        fontSize: 16, 
        color: COLORS.textPrimary,
    },
    // 🚨 NUEVO ESTILO PARA TEXTAREA 🚨
    multilineInput: {
        minHeight: 100, // Altura mínima para el área de texto
        height: 'auto', 
        paddingTop: 12, // Asegura el padding en la parte superior
    },
    inputError: { borderColor: COLORS.errorBorder },
    errorText: { color: COLORS.errorText, fontSize: 12, marginTop: 4 },
    // Ajuste de posición para el ícono de contraseña
    passwordToggle: { 
        position: 'absolute', 
        right: 12, 
        top: 0, 
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
    },
    // Estilo para íconos derechos generales (que no son de contraseña)
    rightIconContainer: {
        position: 'absolute', 
        right: 12, 
        top: 0, 
        bottom: 0, 
        alignItems: 'center',
        justifyContent: 'center',
    }
});