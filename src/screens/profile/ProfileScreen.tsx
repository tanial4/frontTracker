// src/screens/profile/ProfileScreen.tsx

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LogOut, Award } from 'lucide-react-native';

import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { MainLayout } from '../../components/layout/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Profile } from '../../types/user';
import { BackendProfile, BackendUser, getMe, getMyProfile, deleteMyAccount } from '../../services/userApi';

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

export function ProfileScreen({
  user,
  stats,
  onLogout,
  onNavigate,
}: ProfileScreenProps) {
  const [me, setMe] = useState<BackendUser | null>(null);
  const [profile, setProfile] = useState<BackendProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  // 🔹 Cargar /users/me y /users/me/profile cada vez que la pantalla gana foco
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        try {
          setLoading(true);
          setErrorMsg(null);

          const [meRes, profileRes] = await Promise.all([
            getMe(),
            getMyProfile(),
          ]);

          if (!isActive) return;

          setMe(meRes);
          setProfile(profileRes);
        } catch (err) {
          if (!isActive) return;
          console.log('Error cargando perfil', err);
          setErrorMsg('No se pudo cargar tu perfil.');
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  // ---------- Datos combinados (API + props como fallback) ----------

  // Datos de profile si existen
  const fullNameFromProfile = profile?.fullName ?? undefined;
  const avatarFromProfile = profile?.avatarUrl ?? undefined;
  const bioFromProfile = profile?.bio ?? undefined;

  // Nombre a mostrar: si existe fullName en el profile úsalo, si no mostrar 'usuario'
  const displayName: string = fullNameFromProfile ?? 'usuario';

  const email: string = me?.email ?? 'usuario@example.com';

  const effectiveCreatedAt: Date = me?.createdAt
    ? new Date(me.createdAt)
    : user?.createdAt ?? new Date();

  // Avatar: primero del profile, luego el que venía por props
  const avatarURI: string = avatarFromProfile ?? user?.avatarURL ?? '';

  const hasImage = !!avatarURI;

  // Bio: primero del profile del backend, luego cualquier bio que venga por props
  const bio: string | undefined =
    bioFromProfile ?? (user as any)?.bio ?? undefined;

  const initials = getInitials(displayName);

  const userStats = {
    achievements: stats?.achievements ?? 0,
    longestStreak: stats?.longestStreak ?? 0,
  };

  const handleLogoutPress = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: onLogout,
      },
    ]);
  };

  const handleDeleteAccountPress = () => {
    Alert.alert(
      'Eliminar cuenta',
      'Esta acción eliminará permanentemente tu cuenta. ¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar cuenta',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              await deleteMyAccount();
              // Mostrar confirmación y luego cerrar sesión / navegar fuera
              Alert.alert('Cuenta eliminada', 'Tu cuenta ha sido eliminada correctamente.');
              onLogout();
            } catch (err) {
              console.warn('delete account failed', err);
              Alert.alert('Error', 'No se pudo eliminar la cuenta. Intenta de nuevo más tarde.');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

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
              <AvatarFallback fullName={displayName || initials} />
            )}
          </Avatar>

          {loading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={COLORS.PRIMARY} />
              <Text style={styles.loadingText}>Cargando perfil...</Text>
            </View>
          )}

          {errorMsg && !loading && (
            <Text style={styles.errorText}>{errorMsg}</Text>
          )}

          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{email}</Text>
          <Text style={styles.memberSince}>
            {formatMemberSince(effectiveCreatedAt)}
          </Text>

          {/* Bio solo si existe */}
          {bio && <Text style={styles.userBio}>{bio}</Text>}

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
          <TouchableOpacity
            style={[styles.menuItem, styles.logoutButton]}
            onPress={handleLogoutPress}
          >
            <LogOut
              size={20}
              color={COLORS.ERROR_TEXT}
              style={styles.menuIcon}
            />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, styles.deleteButton]}
            onPress={handleDeleteAccountPress}
            disabled={deleting}
          >
            <LogOut
              size={20}
              color={COLORS.ERROR_TEXT}
              style={styles.menuIcon}
            />
            <Text style={[styles.logoutText, { color: COLORS.ERROR_TEXT }]}>Eliminar cuenta</Text>
            {deleting && (
              <ActivityIndicator size="small" color={COLORS.ERROR_TEXT} style={{ marginLeft: 8 }} />
            )}
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

  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  loadingText: {
    marginLeft: 6,
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.ERROR_TEXT,
    marginTop: 4,
    marginBottom: 4,
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
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    marginBottom: 8,
  },
  userBio: {
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
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
  editButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  editButtonText: {
    color: COLORS.BACKGROUND_DEFAULT,
    fontWeight: '600',
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
  logoutButton: {
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
    borderBottomWidth: 0,
  },
  deleteButton: {
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
