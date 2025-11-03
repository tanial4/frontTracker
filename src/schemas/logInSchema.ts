import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string().min(1, { message: 'Ingrese la contraseña' })
    .email("Ingresa un correo válido"),
    
  password: z
    .string().min(1, { message: 'Ingrese la contraseña' })
    .max(50, { message: 'La contraseña no puede exceder los 50 caracteres' }),
});

export type LoginFormType = z.infer<typeof LoginSchema>;
