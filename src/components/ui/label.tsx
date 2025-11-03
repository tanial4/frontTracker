import React from "react";
import { Text, TextProps } from "react-native";
// Importamos cn para combinar las clases base con las que se pasen
import { cn } from "../../lib/utils"; 

// Definición de las clases base del Label
// 'text-foreground' usa tu variable CSS --foreground para el color del texto principal
// 'text-sm' establece un tamaño de fuente de 14px (o el que defina tu tema)
const labelBaseClasses = "text-foreground text-sm font-medium leading-none";

interface LabelProps extends TextProps {
  // Permite pasar clases adicionales
  className?: string; 
}

export function label({ className, ...props }: LabelProps) {
  return (
    <Text
      // Aplicamos las clases base y cualquier clase personalizada
      className={cn(
        labelBaseClasses,
        className
      )}
      {...props}
    />
  );
}

export { label as Label };