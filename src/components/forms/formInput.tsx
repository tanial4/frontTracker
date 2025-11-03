import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, TouchableOpacity, ViewStyle } from 'react-native';
import { useController, useFormContext, FieldError } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react-native';

interface FormInputProps extends TextInputProps {
  name: string;
  label: string;
  isPassword?: boolean;
  isInvalid?: boolean;
}

export function FormInput({ name, label, isPassword = false, isInvalid, ...props }: FormInputProps) {
  const { control, formState: { errors } } = useFormContext();
  const { field } = useController({ name, control });
  const [secureTextEntry, setSecureTextEntry] = useState(isPassword);
  
  const hasError = errors[name] || isInvalid; 
  const error = errors[name] as FieldError | undefined;

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={inputStyles.container}>
      {/* Label */}
      <Text style={inputStyles.label}>{label}</Text>
      
      <View style={inputStyles.inputWrapper}>
        <TextInput
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          style={[inputStyles.input, hasError ? inputStyles.inputError : null]}
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
      </View>

      {error?.message && <Text style={inputStyles.errorText}>{error.message}</Text>}
    </View>
  );
}

const COLORS = {
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
  inputWrapper: { flexDirection: 'row', alignItems: 'center', position: 'relative' },
  input: {
    flex: 1, height: 48, borderWidth: 1, borderColor: COLORS.inputBorder,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 8, paddingHorizontal: 12,
    fontSize: 16, color: COLORS.textPrimary,
  },
  inputError: { borderColor: COLORS.errorBorder },
  errorText: { color: COLORS.errorText, fontSize: 12, marginTop: 4 },
  passwordToggle: { position: 'absolute', right: 12, padding: 5 },
});