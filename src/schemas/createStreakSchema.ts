import { z } from 'zod';

// Normaliza una fecha a 00:00:00 para evitar errores de comparación.
const normalize = (d: Date) => {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
};

const today = normalize(new Date());

export const StreakSchema = z
  .object({
    title: z
      .string()
      .min(3, 'El título es obligatorio y debe tener al menos 3 caracteres.'),

    description: z.string().optional(),

    // Recibido como string ISO → parseado a Date automáticamente
    startdate: z
      .string()
      .refine((v) => !isNaN(Date.parse(v)), {
        message: 'Formato de fecha inválido',
      }),

    endDate: z
      .string()
      .optional()
      .refine((v) => (v ? !isNaN(Date.parse(v)) : true), {
        message: 'Formato de fecha inválido',
      }),
  })

  // 1. startdate NO puede ser pasado
  .refine(
    (data) => {
      const start = normalize(new Date(data.startdate));
      return start >= today;
    },
    {
      message: 'La fecha de inicio no puede ser en el pasado.',
      path: ['startdate'],
    },
  )

  // 2. endDate debe ser mayor que startdate (solo si existe)
  .refine(
    (data) => {
      if (!data.endDate) return true;
      const s = normalize(new Date(data.startdate));
      const e = normalize(new Date(data.endDate));
      return e > s;
    },
    {
      message: 'La fecha de fin debe ser posterior a la fecha de inicio.',
      path: ['endDate'],
    },
  );

// Tipo inferido automáticamente para RHF:
export type StreakFormType = z.infer<typeof StreakSchema>;
