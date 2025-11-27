// src/screens/profile/ProfileScreenContainer.tsx
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import ProfileScreen from "./ProfileScreen";
import { BRAND_COLORS as COLORS } from "../../styles/Colors";
import { getMe } from "../../services/authApi";

export function ProfileScreenContainer({ navigation, onLogout }: any) {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const user = await getMe();

        // NO HAY PROFILE EN /users/me, solo user → adaptamos
        setMe({
          fullName: user.username, // por ahora usa username como nombre
          email: user.email,
          createdAt: new Date(user.createdAt),
          avatarURL: null,
        });
      } catch (e) {
        console.log("Error cargando /users/me:", e);
      }
      setLoading(false);
    })();
  }, []);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator color={COLORS.PRIMARY} size="large" />
      </View>
    );

  return (
    <ProfileScreen
      user={me}
      stats={{ achievements: 0, longestStreak: 0 }}
      onLogout={onLogout}
      onNavigate={(route) => navigation.navigate(route)}
    />
  );
}
