import { z } from "zod";

// Esquema de validación para el flujo de registro de nuevos usuarios.
export const SignupSchema = z.object({

    username: z
        .string()
        .min(1, { message: 'Ingrese un nombre de usuario' })
        // Limitamos la longitud para asegurar que el nombre se visualice correctamente en la UI (Header/Avatar)
        .max(30, { message: 'El nombre de usuario no puede exceder los 30 caracteres' }),

    email: z
        .string()
        .min(1, { message: 'Ingrese un correo electrónico' })
        // Validación de formato estándar (ej: usuario@dominio.com)
        .email("Ingresa un correo válido"),
    
    password: z
        .string()
        .min(1, { message: 'Ingrese la contraseña' })
        // Límite superior por seguridad y restricciones de base de datos
        .max(50, { message: 'La contraseña no puede exceder los 50 caracteres' }),
}); 

// Tipo TypeScript inferido para usar en el formulario de registro (SignUpScreen).
export type SignUpFormType = z.infer<typeof SignupSchema>;