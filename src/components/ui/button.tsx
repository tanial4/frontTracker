import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  // 🚨 FIX DE TIPADO: Propiedad 'textStyle' añadida 🚨
  textStyle?: TextStyle | TextStyle[]; 
  isLoading?: boolean;
  disabled?: boolean;
}

export function Button({ onPress, children, style, textStyle, isLoading = false, disabled = false }: ButtonProps) {
  const isDisabled = disabled || isLoading;
  
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style, isDisabled ? styles.buttonDisabled : null]}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {isLoading ? (
        // Usamos un color de contraste, asumiendo un fondo oscuro del botón
        <ActivityIndicator color="#FFFFFF" /> 
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48, 
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});