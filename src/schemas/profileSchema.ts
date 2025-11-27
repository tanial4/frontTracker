import { z } from "zod";

// Mensaje estándar para reutilizar en validaciones simples de "campo requerido".
const DEFAULT_REQUIRED_MESSAGE = "Este campo es obligatorio";

export const ProfileSchema = z.object({

    // La foto de perfil es opcional, pero si el usuario selecciona una,
    // aplicamos validaciones estrictas para asegurar que la URI sea procesable.
    avatarUrl: z.string().optional()
        // Validación 1: Integridad del string.
        // Si existe un valor, nos aseguramos de que no sea una cadena de espacios vacíos.
        .refine(value => {
            if (value) {
                return value.trim().length > 0;
            }
            return true; // Si es undefined/null, pasa (porque es opcional)
        }, {
            message: "Seleccione una foto de perfil válida",
        })
        // Validación 2: Formato de la URI.
        // Aceptamos 'file://' para imágenes seleccionadas localmente (galería/cámara)
        // y 'http/https' para imágenes que ya existen en el servidor.
        .refine(value => {
            if (!value) {
                return true;
            }
            return value.startsWith('file://') || value.startsWith('http');
        }, {
            message: "El formato de archivo de la foto no es válido."
        }),
        
    fullName: z.string().min(1, DEFAULT_REQUIRED_MESSAGE),
        
    // Limitamos la biografía para mantener la consistencia visual en la tarjeta de perfil.
    bio: z
        .string().min(1, DEFAULT_REQUIRED_MESSAGE)
        .max(150, { message: "La biografía no puede exceder los 150 caracteres" }),
}); 

// Tipo inferido automáticamente para usar con React Hook Form.
export type ProfileFormType = z.infer<typeof ProfileSchema>;