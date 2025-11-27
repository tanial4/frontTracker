import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';

interface InnerScreenLayoutProps {
  title: string;
  children: React.ReactNode;
  // Acción de navegación para regresar (generalmente navigation.goBack())
  onBack: () => void;

  // Espacio opcional en la esquina derecha del header.
  // Útil para botones de acción como "Guardar", "Editar" o iconos de opciones.
  rightSlot?: React.ReactNode;

  // Props de estilo opcionales para permitir personalización puntual
  // sin tener que modificar el componente base.
  containerStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  titleStyle?: TextStyle;
}

// Layout genérico para pantallas internas (detalles, configuraciones, formularios).
// Garantiza una cabecera consistente con botón de retroceso y título en toda la app.
export function InnerScreenLayout({
  title,
  children,
  onBack,
  rightSlot,
  containerStyle,
  headerStyle,
  titleStyle,
}: InnerScreenLayoutProps) {
  return (
    <View style={[styles.screen, containerStyle]}>
      
      {/* HEADER: Barra de navegación superior */}
      <View style={[styles.header, headerStyle]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>

        {/* Título: Usa flex: 1 para ocupar todo el espacio central disponible
            y empujar el slot derecho al extremo. */}
        <Text
          style={[styles.headerTitle, titleStyle]}
          numberOfLines={1} // Trunca el texto si es demasiado largo
        >
          {title}
        </Text>

        {/* Contenedor para el elemento derecho (si existe) */}
        <View style={styles.rightSlot}>
          {rightSlot}
        </View>
      </View>

      {/* CONTENIDO PRINCIPAL: Renderiza los hijos (el cuerpo de la pantalla) */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

// -------------------------------------------------------------
// ESTILOS
// -------------------------------------------------------------

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // Padding superior para compensar visualmente la barra de estado (si no usas SafeAreaView global)
    paddingTop: 18, 
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4, // Aumenta el área de toque
    marginRight: 8,
  },
  headerTitle: {
    flex: 1, 
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  rightSlot: {
    minWidth: 24, // Reserva espacio mínimo para equilibrar visualmente si está vacío
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 8,
  },
  content: {
    flex: 1, // Ocupa el resto de la pantalla
  },
});

export default InnerScreenLayout;