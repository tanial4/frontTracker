// src/components/common/SearchBar.tsx

import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';

interface SearchBarProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  rightIcon?: React.ReactNode; // <-- NUEVO
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar...',
  onClear,
  rightIcon,
}: SearchBarProps) {
  const handleClear = () => {
    if (onClear) onClear();
    else onChange('');
  };

  return (
    <View style={styles.container}>
      <Search size={18} color={COLORS.TEXT_MUTED} style={styles.icon} />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.TEXT_MUTED}
        value={value}
        onChangeText={onChange}
      />

      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear}>
          <Text style={styles.clearText}>X</Text>
        </TouchableOpacity>
      )}

      {/* ⭐️ Right Icon (Opcional, como Users, filtros, etc.) */}
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.INPUT_BACKGROUND,
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    paddingVertical: 0,
    height: 30,
  },
  clearText: {
    color: COLORS.PRIMARY,
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  rightIcon: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
