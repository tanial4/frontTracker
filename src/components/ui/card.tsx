import React from "react";
import { View, Text, ViewProps, TextProps } from "react-native";
import { cn } from "../../lib/utils";

const cardBaseClasses = "bg-card text-card-foreground rounded-xl border border-border flex-col";
const cardHeaderClasses = "px-4 pt-4"; // pX: 16px, pT: 16px
const cardTitleClasses = "text-lg font-bold"; // 18px, 700
const cardDescriptionClasses = "text-sm text-muted-foreground mt-0.5"; // 14px, color secundario, mt: 2px
const cardActionClasses = "self-end p-2"; // p: 8px
const cardContentClasses = "px-4 pb-4"; // pX: 16px, pB: 16px
const cardFooterClasses = "flex-row items-center px-4 pb-4";

// Card Contenedor Principal
function Card({ className, ...props }: ViewProps & { className?: string }) {
  // Las clases 'bg-card', 'border-border', etc., se aplican directamente aquí
  return (
    <View
      className={cn(
        cardBaseClasses, 
        className // Aplica clases personalizadas del padre
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: ViewProps & { className?: string }) {
  return <View className={cn(cardHeaderClasses, className)} {...props} />;
}

function CardTitle({ className, ...props }: TextProps & { className?: string }) {
  return <Text className={cn(cardTitleClasses, className)} {...props} />;
}

function CardDescription({ className, ...props }: TextProps & { className?: string }) {
  return <Text className={cn(cardDescriptionClasses, className)} {...props} />;
}

function CardAction({ className, ...props }: ViewProps & { className?: string }) {
  return <View className={cn(cardActionClasses, className)} {...props} />;
}

function CardContent({ className, ...props }: ViewProps & { className?: string }) {
  return <View className={cn(cardContentClasses, className)} {...props} />;
}

function CardFooter({ className, ...props }: ViewProps & { className?: string }) {
  return <View className={cn(cardFooterClasses, className)} {...props} />;
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};