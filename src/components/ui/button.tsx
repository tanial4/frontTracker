import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

type Variant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type Size = "default" | "sm" | "lg" | "icon";

interface ButtonProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export function Button({
  children,
  onPress,
  disabled,
  variant = "default",
  size = "default",
  loading,
}: ButtonProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <TouchableOpacity
      style={[styles.base, variantStyle, sizeStyle, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : typeof children === "string" ? (
        <Text style={[styles.text, textStyles[variant]]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    fontWeight: "500",
    fontSize: 14,
  },
  disabled: {
    opacity: 0.5,
  },
});

const variantStyles: Record<Variant, ViewStyle> = {
  default: { backgroundColor: "#6f5cff", paddingVertical: 10, paddingHorizontal: 16 },
  destructive: { backgroundColor: "#dc2626", paddingVertical: 10, paddingHorizontal: 16 },
  outline: { borderWidth: 1, borderColor: "#6b7280", paddingVertical: 10, paddingHorizontal: 16 },
  secondary: { backgroundColor: "#e5e7eb", paddingVertical: 10, paddingHorizontal: 16 },
  ghost: { backgroundColor: "transparent", paddingVertical: 10, paddingHorizontal: 16 },
  link: { backgroundColor: "transparent" },
};

const textStyles: Record<Variant, TextStyle> = {
  default: { color: "#fff" },
  destructive: { color: "#fff" },
  outline: { color: "#111" },
  secondary: { color: "#111" },
  ghost: { color: "#111" },
  link: { color: "#6f5cff", textDecorationLine: "underline" },
};

const sizeStyles: Record<Size, ViewStyle> = {
  default: { minHeight: 36, paddingHorizontal: 12 },
  sm: { minHeight: 32, paddingHorizontal: 10 },
  lg: { minHeight: 44, paddingHorizontal: 18 },
  icon: { width: 36, height: 36 },
};
