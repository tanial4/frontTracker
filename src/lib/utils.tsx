// Importa los tipos y la función clsx para concatenar clases condicionalmente.
//    'ClassValue' es el tipo que acepta clsx (string, array, objeto, null, undefined).
import { type ClassValue, clsx } from "clsx"

// Importa twMerge para resolver conflictos de Tailwind (ej. 'p-4' vs 'p-8').
import { twMerge } from "tailwind-merge"

/**
 * Combina múltiples clases de Tailwind de forma condicional y las fusiona 
 * para resolver cualquier conflicto (ej. la última clase de padding gana).
 * * @param inputs - Un array de clases, objetos de clases condicionales, o valores nulos.
 * @returns Una cadena de texto limpia de clases de Tailwind.
 */
export function cn(...inputs: ClassValue[]) {
  // 1. clsx(inputs): Convierte todos los arrays/objetos condicionales en una sola cadena de clases.
  // 2. twMerge(...): Toma esa cadena y elimina los conflictos (ej. 'bg-red-500 bg-blue-500' -> 'bg-blue-500').
  
  return twMerge(clsx(inputs))
}