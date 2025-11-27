import { z } from "zod";

const DEFAULT_REQUIRED_MESSAGE = "Este campo es obligatorio";

export const ProfileSchema = z.object({

    avatarURL: z.string().optional()
        .refine(value => {
            if (value) {
                return value.trim().length > 0;
            }
            return true;
        }, {
            message: "Seleccione una foto de perfil válida",
        })
        .refine(value => {
            if (!value) {
                return true;
            }
            return value.startsWith('file://') || value.startsWith('http');
        }, {
            message: "El formato de archivo de la foto no es válido."
        }),
        
    fullName: z.string().min(1, DEFAULT_REQUIRED_MESSAGE),

    email: z
        .string().min(1, { message: 'Ingrese un correo electrónico' })
        .email("Ingresa un correo válido"),
        
    bio: z
        .string()
        .max(150, { message: "La biografía no puede exceder los 150 caracteres" }).optional(),
}); 

    
export type ProfileFormType = z.infer<typeof ProfileSchema>;