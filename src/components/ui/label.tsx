import React from "react";
import { Text, TextProps } from "react-native";
// Importamos cn para combinar las clases base con las que se pasen
import { cn } from "../../lib/utils"; 


interface LabelProps extends TextProps {
  // Permite pasar clases adicionales
  className?: string; 
}

export function label({ className, ...props }: LabelProps) {
  return (
    <Text
      // Aplicamos las clases base y cualquier clase personalizada
      // @ts-ignore: nativewind 'className' prop (transformada por babel plugin)
      className={cn(
        className
      )}
      {...props}
    />
  );
}

export { label as Label };