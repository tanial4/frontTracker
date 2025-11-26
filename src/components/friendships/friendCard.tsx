import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

// Define la estructura de datos ya procesada que necesita este componente para renderizar.
// Se separa de la interfaz de base de datos para mantener el componente agnóstico al backend.
export interface FriendCardData {
    id: string;          // ID de la relación de amistad
    friendUserId: string; // ID del usuario amigo (necesario para la navegación o acciones)
    fullName: string;
    username: string;
    avatarURL: string | null;
}

interface FriendCardProps {
    friend: FriendCardData;
    // Acción a ejecutar al tocar la tarjeta (ej: navegar al perfil o abrir chat)
    onPress: () => void;
}

// Componente presentacional que muestra una fila con la información resumida de un amigo.
// Diseñado para ser usado dentro de listas (FlatList o map).
export function FriendCard({ friend, onPress }: FriendCardProps) {
    // Verificación rápida para decidir si mostrar imagen o iniciales
    const hasImage = !!friend.avatarURL;

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85} // Feedback visual sutil al presionar
            style={styles.rowContainer}
        >
            {/* Sección del Avatar: Maneja automáticamente la carga de imagen o el fallback */}
            <Avatar style={styles.avatar}>
                {hasImage ? (
                    // El signo de exclamación (!) asegura a TS que avatarURL no es null aquí
                    <AvatarImage source={{ uri: friend.avatarURL! }} />
                ) : (
                    <AvatarFallback fullName={friend.fullName} />
                )}
            </Avatar>

            {/* Contenedor de texto con borde inferior separador */}
            <View style={styles.textContainer}>
                <Text style={styles.nameText}>{friend.fullName}</Text>
                <Text style={styles.usernameText}>@{friend.username}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    // Contenedor principal de la fila. Alinea el avatar y el texto horizontalmente.
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 10,
        width: '100%',
    },

    avatar: {
        marginRight: 12,
    },

    // El contenedor de texto ocupa el resto del espacio (flex: 1).
    // El borde inferior se aplica aquí y no en el rowContainer para que el borde
    // empiece alineado con el texto (dejando el hueco debajo del avatar), estilo iOS/WhatsApp.
    textContainer: {
        flexDirection: 'column',
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER_COLOR,
        paddingBottom: 10,
    },

    nameText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.TEXT_PRIMARY,
    },

    usernameText: {
        fontSize: 13,
        color: COLORS.TEXT_MUTED,
        marginTop: 2,
    },
});

export default FriendCard;