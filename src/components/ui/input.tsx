import React from "react";
import { TextInput, TextInputProps } from "react-native";
// Importamos la utilidad cn para combinar clases condicionales
import { cn } from "../../lib/utils"; 

// Definición de las clases base del Input
const inputBaseClasses = "h-10 border border-border rounded-md px-3 text-sm text-foreground bg-input";

// Nota: Las props de TextInput ya incluyen las props de color y estilo.
interface InputProps extends TextInputProps {
  // Opcionalmente, puedes añadir una prop className para extender las clases base
  className?: string; 
}

export function Input({ className, ...props }: InputProps) {
  return (
    <TextInput
      // Aplicamos las clases base y cualquier clase personalizada pasada por el padre
      // @ts-ignore: nativewind 'className' prop (transformada por babel plugin)
      className={cn(
        inputBaseClasses,
        // Clases de enfoque (focus): Opcionalmente, puedes agregar estilos de enfoque
        // que usarán tu color primario al activar el campo (si lo deseas):
        "focus:border-primary",
        className
      )}
      // Usamos el color de texto del tema 'muted-foreground' para el placeholder
      placeholderTextColor="var(--muted-foreground)" 
      {...props}
    />
  );
}