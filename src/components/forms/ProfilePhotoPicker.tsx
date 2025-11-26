import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { Camera } from 'lucide-react-native';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { formComponentStyles } from '../../styles/GlobalStyles'; 

// Definición de las propiedades del componente.
interface ProfilePhotoPickerProps {
    // Nombre del campo en el formulario (ej: 'avatarURL')
    name: string;
    
    // Se usa para generar las iniciales (fallback) si no hay foto
    fullName: string;
    
    // Permite deshabilitar la interacción (ej: modo solo lectura)
    isEditable?: boolean;
    
    // Función crítica: Inyecta la lógica de apertura de galería/cámara.
    // Recibe la función 'onChange' de React Hook Form para que, una vez seleccionada la foto,
    // se pueda actualizar el estado del formulario desde fuera.
    onImageSelect: (onChange: (uri: string | undefined) => void) => void;
}

// Componente para seleccionar foto de perfil.
// Combina la visualización (Avatar) con la lógica de formulario (Controller).
export function ProfilePhotoPicker({ 
    name, 
    fullName, 
    onImageSelect, 
    isEditable = true 
}: ProfilePhotoPickerProps) {
    
    const { control } = useFormContext();
    
    // Wrapper para manejar el evento de presionar.
    // Solo ejecuta la lógica de selección si el componente es editable.
    const handlePress = (onChange: (uri: string | undefined) => void) => {
        if (isEditable) {
            onImageSelect(onChange); 
        }
    };

    return (
        <Controller
            control={control}
            name={name}
            // El valor esperado es un string (URI de la imagen) o undefined
            render={({ field: { onChange, value } }) => {
                const avatarURI = value as string;
                const hasImage = !!avatarURI;
                
                return (
                    // El contenedor debe tener position: 'relative' para que el icono de la cámara
                    // pueda posicionarse absolutamente respecto a este bloque.
                    <View style={styles.container}> 
                        
                        {/* Área principal del Avatar (Clickable) */}
                        <TouchableOpacity 
                            style={styles.avatarWrapper}
                            onPress={() => handlePress(onChange)} 
                            disabled={!isEditable}
                            activeOpacity={isEditable ? 0.8 : 1}
                        >
                            <Avatar style={styles.avatarSize}> 
                                {hasImage ? (
                                    <AvatarImage source={{ uri: avatarURI }} />
                                ) : (
                                    <AvatarFallback fullName={fullName} />
                                )}
                            </Avatar>
                        </TouchableOpacity>

                        {/* Botón flotante de la cámara.
                            Se renderiza solo si es editable y se superpone al avatar. */}
                        {isEditable && (
                            <TouchableOpacity 
                                style={styles.cameraIconWrapper} 
                                onPress={() => handlePress(onChange)}
                                activeOpacity={0.8}
                            >
                                <Camera size={20} color={COLORS.BACKGROUND_DEFAULT} />
                            </TouchableOpacity>
                        )}
                    </View>
                );
            }}
        />
    );
}

// -------------------------------------------------------------
// ESTILOS
// -------------------------------------------------------------

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
        // Crucial para el posicionamiento absoluto de los hijos (icono de cámara)
        position: 'relative', 
    },
    // Contenedor circular base
    avatarWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        // Asegura que la imagen no se salga del círculo
        overflow: 'hidden', 
        backgroundColor: COLORS.BACKGROUND_DEFAULT,
    },
    // Estilo que se pasa al componente Avatar importado
    avatarSize: { 
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    // Estilo para el botón de editar foto
    cameraIconWrapper: {
        position: 'absolute',
        // Ajuste fino para colocar el icono en la esquina inferior derecha del círculo
        bottom: 0, 
        right: -5, // Un poco hacia afuera para dar efecto de "badge"
        
        backgroundColor: COLORS.PRIMARY, 
        borderRadius: 100, // Completamente redondo
        padding: 8,
        
        // Borde del mismo color que el fondo para separarlo visualmente del avatar
        borderWidth: 3,
        borderColor: COLORS.BACKGROUND_DEFAULT,
        
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10, // Asegura que esté por encima de la imagen
    },
    errorText: {
        ...formComponentStyles.errorText,
        marginTop: 4,
    }
});