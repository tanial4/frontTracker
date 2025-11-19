import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LogOut, Settings, Bell, Mail, Users, Edit3, Award } from 'lucide-react-native'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BRAND_COLORS as COLORS } from '../styles/Colors';
import { globalLayout, formComponentStyles } from '../styles/GlobalStyles'; 
import { BottomNavigationBar } from '../components/navigation/navBar';
import { MOCK_USER_DATA, MOCK_USER_STATS, ACTIVE_ROUTE } from '../data/TestUserData';

interface ProfileScreenProps {
    // Props simuladas del usuario autenticado
    user?: Profile & { email: string; createdAt: Date; };
    stats: { achievements: number; longestStreak: number; };
    onLogout: () => void;
    onNavigate: (route: string) => void;
}

// -------------------------------------------------------------
// DATOS FIJOS DEL MENÚ DE OPCIONES
// -------------------------------------------------------------
const OPTIONS_MENU = [
    { title: "Configuración", icon: Settings, route: "Settings" },
    { title: "Recordatorios", icon: Bell, route: "Reminders" },
    { title: "Invitar Amigos", icon: Users, route: "InviteFriends" },
];


export function ProfileScreen({ user, stats, onLogout, onNavigate }: ProfileScreenProps) {
    const insets = useSafeAreaInsets();

    const userData = user || MOCK_USER_DATA;
    const userStats = stats || MOCK_USER_STATS;

    const activeRoute = 'Profile'; 

    return (
        // Contenedor principal con fondo (usa el estilo seguro global)
        <View style={[globalLayout.safeArea, styles.mainContainer, { paddingTop: insets.top }]}>
            
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* --- 1. SECCIÓN DE PERFIL Y CABECERA --- */}
                <View style={styles.profileHeader}>
                    {/* Avatar (letra U en círculo púrpura) */}
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{user?.fullName.charAt(0)}</Text>
                    </View>
                    <Text style={styles.userName}>{user?.fullName}</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                    <Text style={styles.memberSince}>Miembro desde {user?.createdAt.toLocaleDateString()}</Text>

                    {/* Botón de Editar Perfil */}
                    <TouchableOpacity style={styles.editButton} onPress={() => onNavigate('EditProfile')}>
                        <Text style={styles.editButtonText}>Editar Perfil</Text>
                    </TouchableOpacity>
                </View>

                {/* --- 2. TARJETAS DE ESTADÍSTICAS --- */}
                <View style={styles.statsContainer}>
                    {/* Tarjeta de Logros */}
                    <View style={styles.statCard}>
                        <View style={styles.statIconWrapper}>
                            <Award size={24} color={COLORS.primary} />
                        </View>
                        <Text style={styles.statValueActive}>{stats.achievements}</Text>
                        <Text style={styles.statLabel}>Logros</Text>
                    </View>
                    
                    {/* Tarjeta de Racha Más Larga */}
                    <View style={styles.statCard}>
                        <View style={styles.statIconWrapper}>
                            {/* Puedes usar otro icono aquí si lo deseas */}
                        </View>
                        <Text style={styles.statValue}>{stats.longestStreak}</Text>
                        <Text style={styles.statLabel}>Racha más larga</Text>
                    </View>
                </View>

                {/* --- 3. MENÚ DE OPCIONES (Lista) --- */}
                <View style={styles.menuContainer}>
                    {OPTIONS_MENU.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <TouchableOpacity 
                                key={index} 
                                style={styles.menuItem}
                                onPress={() => onNavigate(item.route)}
                            >
                                <Icon size={20} color={COLORS.TEXT_PRIMARY} style={styles.menuIcon} />
                                <Text style={styles.menuText}>{item.title}</Text>
                            </TouchableOpacity>
                        );
                    })}

                    {/* Opción de Cerrar Sesión (Destructiva) */}
                    <TouchableOpacity 
                        style={[styles.menuItem, styles.logoutButton]} 
                        onPress={onLogout}
                    >
                        <LogOut size={20} color={COLORS.ERROR_TEXT} style={styles.menuIcon} />
                        <Text style={styles.logoutText}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
            
            {/* --- 4. BARRA DE NAVEGACIÓN INFERIOR (Navbar) --- */}
            <BottomNavigationBar activeRoute={activeRoute} onNavigate={onNavigate} />

        </View>
    );
}

// -------------------------------------------------------------
// ESTILOS ESPECÍFICOS DE PROFILE SCREEN
// -------------------------------------------------------------
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.WHITE, // Usa el color de fondo principal
    },
    scrollContent: {
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        // Agregamos padding horizontal si el layout global no lo tiene
        paddingHorizontal: 20, 
    },

    // --- 1. Cabecera (Avatar e Información) ---
    profileHeader: {
        alignItems: 'center',
        marginBottom: 30,
        width: '100%',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.GRAY_ACCENT, // Fondo gris claro
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.TEXT_PRIMARY,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.TEXT_PRIMARY,
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 14,
        color: COLORS.TEXT_MUTED,
        marginBottom: 10,
    },
    memberSince: {
        fontSize: 12,
        color: COLORS.primary, // Usando el púrpura
        marginBottom: 15,
    },
    editButton: {
        borderWidth: 1,
        borderColor: COLORS.GRAY_BORDER,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    editButtonText: {
        fontSize: 14,
        color: COLORS.TEXT_PRIMARY,
    },

    // --- 2. Tarjetas de Estadísticas ---
    statsContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: 30,
        maxWidth: 380,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: COLORS.GRAY_BORDER,
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        marginHorizontal: 5,
        shadowColor: COLORS.BLACK,
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    statIconWrapper: {
        marginBottom: 8,
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.TEXT_PRIMARY,
    },
    statValueActive: { // Estilo para Logros (activo/púrpura)
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.primary, // Color de acento
    },
    statLabel: {
        fontSize: 14,
        color: COLORS.TEXT_MUTED,
    },

    // --- 3. Menú de Opciones (Lista) ---
    menuContainer: {
        width: '100%',
        maxWidth: 380,
        backgroundColor: COLORS.WHITE,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.GRAY_BORDER,
        overflow: 'hidden', // Asegura que no haya desbordamiento
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderColor: COLORS.GRAY_ACCENT,
    },
    menuIcon: {
        marginRight: 15,
    },
    menuText: {
        fontSize: 16,
        color: COLORS.TEXT_PRIMARY,
    },
    logoutButton: {
        backgroundColor: COLORS.WHITE, // Fondo blanco
        borderBottomWidth: 0, // Último elemento sin borde inferior
    },
    logoutText: {
        fontSize: 16,
        color: COLORS.ERROR_TEXT, // Color rojo para acción destructiva
        fontWeight: '500',
    }
});