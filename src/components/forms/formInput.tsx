import React, { useState } from 'react';
import { View, Text, TextInputProps, TouchableOpacity } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react-native';
import { cn } from '../../lib/utils'; 
import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface FormInputProps extends TextInputProps {
  name: string;
  label: string;
  isPassword?: boolean;
  maxChars?: number;
  helperText?: string;
}

export function FormInput({
  name,
  label,
  isPassword = false,
  maxChars,
  helperText,
  ...props
}: FormInputProps) {
  const { control, formState } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const error = formState.errors[name];

  return (
    <View className="space-y-1">
      
      {/* Etiqueta */}
      <Label className="mb-1.5">{label}</Label>
      
      {/* Contenedor del Input (necesario para el ícono de ojo) */}
      <View className={cn({ "relative": isPassword })}>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              // Vinculación de react-hook-form
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              
              // Clases de estilo y validación
              className={cn(
                "pr-3", // Base padding
                { "border-destructive": error }, // Borde destructivo si hay error
                { "pr-10": isPassword } // Padding extra si es contraseña
              )}
              
              // Props de contraseña
              secureTextEntry={isPassword && !showPassword}
              maxLength={maxChars}
              {...props}
            />
          )}
        />

        {/* Botón de Ojo (para contraseñas) */}
        {isPassword && (
          <TouchableOpacity 
            onPress={() => setShowPassword(s => !s)} 
            className="absolute right-2 top-0 bottom-0 w-8 items-center justify-center"
            activeOpacity={0.7}
          >
            {showPassword ? <EyeOff size={20} className="text-muted-foreground" /> : <Eye size={20} className="text-muted-foreground" />}
          </TouchableOpacity>
        )}
      </View>

      {/* Mensaje de Error (Usando el color destructivo del tema) */}
      {error && (
            <Text className="text-destructive text-xs mt-1">
                {String(error.message)} {/* 👈 Solución: Conversión explícita */}
            </Text>
        )}

      {/* Texto de ayuda opcional */}
      {helperText && !error && (
        <Text className="text-muted-foreground text-xs mt-1">
          {helperText}
        </Text>
      )}
    </View>
  );
}