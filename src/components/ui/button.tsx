import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  GestureResponderEvent,
} from "react-native";
import { cn } from "../../lib/utils";

type Variant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type Size = "default" | "sm" | "lg" | "icon";

interface ButtonProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  className?: string; 
}

// -------------------------------------------------------------
// CLASES BASE, VARIANTE Y TAMAÑO
// -------------------------------------------------------------

const getVariantClasses = (variant: Variant): string => {
  switch (variant) {
    case "destructive":
      return "bg-destructive text-primary-foreground border-transparent hover:opacity-80";
    case "outline":
      return "bg-transparent text-foreground border border-border hover:bg-accent";
    case "secondary":
      return "bg-secondary text-foreground border-transparent hover:bg-accent";
    case "ghost":
      return "bg-transparent text-foreground border-transparent hover:bg-accent";
    case "link":
      return "bg-transparent text-primary border-transparent underline"; 
    case "default":
    default:
      return "bg-primary text-primary-foreground border-transparent hover:opacity-80"; 
  }
};

const getSizeClasses = (size: Size): string => {
  switch (size) {
    case "sm":
      return "h-8 px-2.5 text-xs";
    case "lg":
      return "h-11 px-4 text-base";
    case "icon":
      return "w-9 h-9 p-0 flex-none";
    case "default":
    default:
      return "h-9 px-3 text-sm";
  }
};

// -------------------------------------------------------------
// COMPONENTE BUTTON
// -------------------------------------------------------------

export function Button({
  children,
  onPress,
  disabled,
  variant = "default",
  size = "default",
  loading,
  className,
}: ButtonProps) {
  
  const baseClasses = "rounded-md items-center justify-center flex-row font-medium transition-colors duration-150";

  const indicatorColor = (
      variant === "default" || variant === "destructive" ? "#fff" : 
      variant === "link" ? "hsl(240 5.9% 90%)" : 
      "hsl(240 10% 3.9%)"
  );

  return (
    <TouchableOpacity
      className={cn(
        baseClasses,
        getVariantClasses(variant),
        getSizeClasses(size),
        { 'opacity-50': disabled || loading }, 
        className 
      )}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={indicatorColor} />
      ) : typeof children === "string" ? (
        <Text
          className={cn(
            "font-medium text-center", 
            variant === "link" && "text-primary"
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}