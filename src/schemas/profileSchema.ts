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
        
}); 

    
export type ProfileFormType = z.infer<typeof ProfileSchema>;