import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';

interface SearchBarProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  // Callback opcional para ejecutar lógica extra al limpiar (ej: resetear filtros)
  onClear?: () => void;
  // Slot flexible para colocar elementos a la derecha (ej: icono de filtros o de agregar usuario)
  rightIcon?: React.ReactNode; 
}

// Componente reutilizable de barra de búsqueda.
// Incluye icono de lupa, input de texto, botón de limpiar condicional y slot para acciones extra.
export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar...',
  onClear,
  rightIcon,
}: SearchBarProps) {
  
  const handleClear = () => {
    // Si el padre pasó una función específica para limpiar, la usamos.
    // Si no, simplemente vaciamos el texto mediante el onChange.
    if (onClear) onClear();
    else onChange('');
  };

  return (
    <View style={styles.container}>
      {/* Icono de búsqueda fijo a la izquierda */}
      <Search size={18} color={COLORS.TEXT_MUTED} style={styles.icon} />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.TEXT_MUTED}
        value={value}
        onChangeText={onChange}
      />

      {/* Botón "X" para limpiar: Solo se renderiza si hay texto escrito */}
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear}>
          <Text style={styles.clearText}>X</Text>
        </TouchableOpacity>
      )}

      {/* Renderizado condicional del slot derecho (Right Icon) */}
      {/* Se envuelve en una View para garantizar el espaciado correcto */}
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
    flex: 1, // Ocupa todo el espacio disponible entre el icono y los botones derechos
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    paddingVertical: 0, // Corrige alineación en Android
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