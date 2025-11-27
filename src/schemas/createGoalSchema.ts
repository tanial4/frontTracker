// src/schemas/createGoalSchema.ts
import { z } from 'zod';

const normalizeDate = (d: Date) => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
};
const today = normalizeDate(new Date());

export const GoalTargetTypeEnum = z.enum([
  'DAILY',
  'WEEKLY',
  'COUNT',
  'BOOLEAN',
]);

export const GoalSchema = z
  .object({
    title: z.string().min(3, 'El nombre de la meta es obligatorio.'),

    // 👇 AQUÍ: obligatorio, NADA de nullable
    categoryId: z
      .string({
        required_error: 'Selecciona una categoría.',
        invalid_type_error: 'Selecciona una categoría.',
      })
      .min(1, 'Selecciona una categoría.'),

    description: z.string().optional(),

    targetType: GoalTargetTypeEnum,

    targetValue: z
      .union([z.number().int().min(1), z.null()])
      .optional(),

    startDate: z.date({
      required_error: 'La fecha de inicio es obligatoria',
      invalid_type_error: 'Formato de fecha inválido',
    }),

    endDate: z
      .date({
        required_error: 'La fecha de fin es obligatoria',
        invalid_type_error: 'Formato de fecha inválido',
      })
      .nullable(),

    daysPerWeek: z.string().optional(),
  })
  .refine((data) => normalizeDate(data.startDate) >= today, {
    message: 'La fecha de inicio no puede ser en el pasado.',
    path: ['startDate'],
  })
  .refine(
    (data) => {
      if (!data.endDate) return true;
      const end = normalizeDate(data.endDate);
      const start = normalizeDate(data.startDate);
      return end > start;
    },
    {
      message: 'La fecha de fin debe ser posterior a la fecha de inicio.',
      path: ['endDate'],
    },
  )
  .superRefine((data, ctx) => {
    if (data.targetType === 'WEEKLY') {
      const n = Number(data.daysPerWeek);
      if (!n || n < 1 || !Number.isFinite(n)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['daysPerWeek'],
          message: 'Ingresa cuántos días por semana (>= 1)',
        });
      }
    }
  });

export type GoalFormType = z.infer<typeof GoalSchema>;
