import { z } from 'zod';

// Normaliza fecha a medianoche para comparar solo por día
const normalizeDate = (d: Date) => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const today = normalizeDate(new Date());

export const GoalSchema = z
  .object({
    // Campos obligatorios
    name: z.string().min(3, 'El nombre de la meta es obligatorio.'),
    categoryId: z.string().min(1, 'Selecciona una categoría.'),

    description: z.string().optional(),

    startDate: z.date({
      required_error: 'La fecha de inicio es obligatoria',
      invalid_type_error: 'Formato de fecha inválido',
    }),

    endDate: z.date({
      required_error: 'La fecha de fin es obligatoria',
      invalid_type_error: 'Formato de fecha inválido',
    }),

    targetType: z.string(),
  })

  // ✅ startDate >= hoy
  .refine((data) => normalizeDate(data.startDate) >= today, {
    message: 'La fecha de inicio no puede ser en el pasado.',
    path: ['startDate'],
  })

  // ✅ endDate >= hoy
  .refine((data) => normalizeDate(data.endDate) >= today, {
    message: 'La fecha de finalización no puede ser en el pasado.',
    path: ['endDate'],
  })

  // ✅ endDate > startDate
  .refine(
    (data) =>
      normalizeDate(data.endDate) > normalizeDate(data.startDate),
    {
      message: 'La fecha de fin debe ser posterior a la fecha de inicio.',
      path: ['endDate'],
    }
  );

export type GoalFormType = z.infer<typeof GoalSchema>;
