import { z } from "zod";

// Esquema de validación para el formulario de inicio de sesión.
// Define las reglas y los mensajes de error que se mostrarán al usuario.
export const LoginSchema = z.object({
  email: z
    .string()
    // Primero validamos que el campo no esté vacío
    .min(1, { message: 'Ingrese un correo electrónico' })
    // Luego validamos que cumpla con el formato estándar de email
    .email("Ingresa un correo válido"),
    
  password: z
    .string()
    .min(1, { message: 'Ingrese la contraseña' })
    // Establecemos un límite superior razonable por seguridad y restricciones de BD
    .max(50, { message: 'La contraseña no puede exceder los 50 caracteres' }),
});

// Tipo TypeScript inferido automáticamente desde el esquema.
// Se utiliza para tipar el hook useForm y asegurar que los datos coincidan con la validación.
export type LoginFormType = z.infer<typeof LoginSchema>;