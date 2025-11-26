import { z } from "zod";

export const SignupSchema = z.object({

    username: z
    .string().min(1, { message: 'Ingrese un nombre de usuario' })
    .max(30, { message: 'El nombre de usuario no puede exceder los 30 caracteres' }),

  email: z
    .string().min(1, { message: 'Ingrese un correo electrónico' })
    .email("Ingresa un correo válido"),
    
  password: z
    .string().min(1, { message: 'Ingrese la contraseña' })
    .max(50, { message: 'La contraseña no puede exceder los 50 caracteres' }),

    
})

  

export type SignUpFormType = z.infer<typeof SignupSchema>;
