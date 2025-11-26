import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { LogOut, Settings, Bell, Users, Award } from 'lucide-react-native';

import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { MainLayout } from '../../components/layout/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Profile } from '../../types/user';

// TIPOS
interface ProfileScreenProps {
  user?: Partial<Profile> & {
    email: string;
    createdAt: Date;
    avatarURL?: string | null;
  };
  stats?: {
    achievements: number;
    longestStreak: number;
  };
  onLogout: () => void;
  onNavigate: (route: string) => void;
}

// MENÚ
const OPTIONS_MENU = [
  { title: 'Configuración', icon: Settings, route: 'Settings' },
  { title: 'Recordatorios', icon: Bell, route: 'Reminders' },
  { title: 'Invitar Amigos', icon: Users, route: 'InviteFriends' },
];

const getInitials = (fullName: string): string => {
  if (!fullName) return 'U';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const formatMemberSince = (date?: Date) => {
  if (!date) return 'Miembro reciente';
  try {
    return `Miembro desde ${date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
    })}`;
  } catch {
    return 'Miembro desde hace poco';
  }
};

// PROFILE SCREEN (DENTRO DE MAINLAYOUT)
export function ProfileScreen({
  user,
  stats,
  onLogout,
  onNavigate,
}: ProfileScreenProps) {
  const userData = user ?? {
    fullName: 'Usuario Anónimo',
    email: 'usuario@example.com',
    createdAt: new Date(),
    avatarURL: null,
  };

  const userStats = {
    achievements: stats?.achievements ?? 0,
    longestStreak: stats?.longestStreak ?? 0,
  };

  const initials = getInitials(userData.fullName || '');
  const avatarURI = userData.avatarURL || '';
  const hasImage = !!avatarURI;

  return (
    <MainLayout
      headerTitle="Perfil"
      activeRoute="Profile"
      onNavigate={onNavigate}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- 1. CABECERA DE PERFIL --- */}
        <View style={styles.profileHeader}>
          <Avatar style={{ width: 150, height: 150 }}>
            {hasImage ? (
              <AvatarImage source={{ uri: avatarURI }} />
            ) : (
              <AvatarFallback fullName={userData.fullName || initials} />
            )}
          </Avatar>

          <Text style={styles.userName}>{userData.fullName}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          <Text style={styles.memberSince}>
            {formatMemberSince(userData.createdAt)}
          </Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onNavigate('EditProfile')}
          >
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* --- 2. ESTADÍSTICAS --- */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconWrapper}>
              <Award size={24} color={COLORS.PRIMARY} />
            </View>
            <Text style={styles.statValueActive}>
              {userStats.achievements}
            </Text>
            <Text style={styles.statLabel}>Metas Cumplidas</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconWrapper}>
              <Award size={24} color={COLORS.TEXT_MUTED} />
            </View>
            <Text style={styles.statValue}>{userStats.longestStreak}</Text>
            <Text style={styles.statLabel}>Racha más larga</Text>
          </View>
        </View>

        {/* --- 3. MENÚ --- */}
        <View style={styles.menuContainer}>
          {OPTIONS_MENU.map((item, index) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => onNavigate(item.route)}
              >
                <Icon
                  size={20}
                  color={COLORS.TEXT_PRIMARY}
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>{item.title}</Text>
              </TouchableOpacity>
            );
          })}

          {/* 🔴 CERRAR SESIÓN 🔴   */}
          <TouchableOpacity
            style={[styles.menuItem, styles.logoutButton]}
            onPress={onLogout}
          >
            <LogOut
              size={20}
              color={COLORS.ERROR_TEXT}
              style={styles.menuIcon}
            />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </MainLayout>
  );
}

// -------------------------------------------------------------
// ESTILOS
// -------------------------------------------------------------
const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },

  // Header
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginTop: 10,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    marginBottom: 16,
  },
  editButton: {
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 30,
    maxWidth: 380,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statIconWrapper: {
    marginBottom: 6,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  statValueActive: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    marginTop: 2,
  },

  // Menu
  menuContainer: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
  },
  menuIcon: {
    marginRight: 14,
  },
  menuText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  logoutButton: {
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
    borderBottomWidth: 0,
  },
  logoutText: {
    fontSize: 16,
    color: COLORS.ERROR_TEXT,
    fontWeight: '600',
  },
});

export default ProfileScreen;
