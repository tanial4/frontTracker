// src/components/layout/ChatLayout.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface ChatLayoutProps {
  title: string;
  avatarURL?: string | null;
  headerSubtitle?: string; // ej: "En línea" o "Últ. vez hace 2h"
  children: React.ReactNode;

  onBackPress: () => void;
  onPressHeader?: () => void; // al tocar avatar + nombre
}

export function ChatLayout({
  title,
  avatarURL,
  headerSubtitle = 'En línea',
  children,
  onBackPress,
  onPressHeader,
}: ChatLayoutProps) {
  const initials = getInitials(title);

  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={22} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerCenter}
          activeOpacity={0.8}
          onPress={onPressHeader}
          disabled={!onPressHeader}
        >
          <Avatar>
            {avatarURL ? (
              <AvatarImage source={{ uri: avatarURL }} />
            ) : (
              <AvatarFallback fullName={title}>
                <Text style={styles.avatarText}>{initials}</Text>
              </AvatarFallback>
            )}
          </Avatar>

          <View style={styles.headerTextWrapper}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>
            {!!headerSubtitle && (
              <Text style={styles.headerSubtitle} numberOfLines={1}>
                {headerSubtitle}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Espaciador lado derecho */}
        <View style={styles.headerRightSpacer} />
      </View>

      {/* CONTENIDO DEL CHAT */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

function getInitials(text: string): string {
  if (!text) return 'U';
  const parts = text.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}

interface Style {
  screen: ViewStyle;
  header: ViewStyle;
  backButton: ViewStyle;
  headerCenter: ViewStyle;
  headerTextWrapper: ViewStyle;
  headerRightSpacer: ViewStyle;
  headerTitle: TextStyle;
  headerSubtitle: TextStyle;
  content: ViewStyle;
  avatarText: TextStyle;
}

const styles = StyleSheet.create<Style>({
  screen: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,

    // ⭐ Sombra iOS
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,

    // ⭐ Sombra Android
    elevation: 5,
    

    // ⭐ Para asegurarnos que quede "encima" del contenido
    zIndex: 10,
    },



  backButton: {
    padding: 4,
    marginRight: 4,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTextWrapper: {
    marginLeft: 10,
    flexShrink: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
    marginTop: 2,
  },
  headerRightSpacer: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
});

export default ChatLayout;
