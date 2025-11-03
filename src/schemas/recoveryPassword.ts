import { z } from "zod";

export const RecoverySchema = z.object({
  email: z
    .string().min(1, { message: 'Ingrese un correo electrónico' })
    .email("Ingresa un correo válido"),
});

export type RecoveryFormType = z.infer<typeof RecoverySchema>;
