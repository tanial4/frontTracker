import { z } from 'zod';

// Función auxiliar para "resetear" la hora de una fecha a 00:00:00.
// Esto es fundamental para comparar fechas sin que la hora actual interfiera
// (ej: evitar que "hoy a las 10am" sea considerado menor que "hoy a las 8pm").
const normalizeDate = (d: Date) => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

// Fecha actual normalizada para validaciones de "no pasado".
const today = normalizeDate(new Date());

// Enumeración de los tipos de frecuencia soportados por el sistema.
export const GoalTargetTypeEnum = z.enum([
  'DAILY',
  'WEEKLY',
  'COUNT',
  'BOOLEAN',
]);

export const GoalSchema = z
  .object({
    title: z.string().min(3, 'El nombre de la meta es obligatorio.'),

    // Validación estricta para la categoría.
    // Zod lanzará error si el campo llega como null, undefined o string vacío.
    categoryId: z
      .string({
        required_error: 'Selecciona una categoría.',
        invalid_type_error: 'Selecciona una categoría.',
      })
      .min(1, 'Selecciona una categoría.'),

    description: z.string().optional(),

    targetType: GoalTargetTypeEnum,

    // Valor numérico objetivo (ej: 5 veces, 30 minutos). Puede ser nulo.
    targetValue: z
      .union([z.number().int().min(1), z.null()])
      .optional(),

    startDate: z.date({
      required_error: 'La fecha de inicio es obligatoria',
      invalid_type_error: 'Formato de fecha inválido',
    }),

    // La fecha de fin es nullable para permitir metas indefinidas (si la lógica de negocio lo soporta)
    endDate: z
      .date({
        required_error: 'La fecha de fin es obligatoria',
        invalid_type_error: 'Formato de fecha inválido',
      })
      .nullable(),

    // Se recibe como string desde el TextInput, se valida numéricamente en el superRefine
    daysPerWeek: z.string().optional(),
  })
  
  // 1. Validación: La fecha de inicio no puede ser anterior a hoy (normalizado)
  .refine((data) => normalizeDate(data.startDate) >= today, {
    message: 'La fecha de inicio no puede ser en el pasado.',
    path: ['startDate'],
  })
  
  // 2. Validación: Coherencia temporal (Fin debe ser > Inicio)
  .refine(
    (data) => {
      if (!data.endDate) return true; // Si no hay fecha fin, es válido
      const end = normalizeDate(data.endDate);
      const start = normalizeDate(data.startDate);
      return end > start;
    },
    {
      message: 'La fecha de fin debe ser posterior a la fecha de inicio.',
      path: ['endDate'],
    },
  )
  
  // 3. Validación Condicional (Dependencia de campos)
  // Si el usuario elige "Semanal" (WEEKLY), validamos que 'daysPerWeek' tenga un número válido.
  .superRefine((data, ctx) => {
    if (data.targetType === 'WEEKLY') {
      const n = Number(data.daysPerWeek);
      
      // Verificamos que sea un número válido, mayor o igual a 1 y finito.
      if (!n || n < 1 || !Number.isFinite(n)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['daysPerWeek'],
          message: 'Ingresa cuántos días por semana (>= 1)',
        });
      }
    }
  });

// Tipo inferido automáticamente para usar en React Hook Form
export type GoalFormType = z.infer<typeof GoalSchema>;