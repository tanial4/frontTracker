import { z } from 'zod';

// Normaliza fecha a medianoche para comparar solo por día
const normalizeDate = (d: Date) => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const today = normalizeDate(new Date());


export const GoalTargetTypeEnum = z.enum(['DAILY', 'WEEKLY', 'COUNT', 'BOOLEAN']);

export const GoalSchema = z
  .object({

    title: z.string().min(3, 'El nombre de la meta es obligatorio.'),
    
    
    categoryId: z.string().min(1, 'Selecciona una categoría.').nullable(), // Permite null si el DTO lo permite opcional con string | null
    
    description: z.string().optional(),

    
    targetType: GoalTargetTypeEnum, 

    
    targetValue: z
      .union([z.number().int().min(1), z.null()])
      .optional(), // Puede ser number o null, y es opcional
      
    
    startDate: z.date({
      required_error: 'La fecha de inicio es obligatoria',
      invalid_type_error: 'Formato de fecha inválido',
    }),

    
    endDate: z.date({
      required_error: 'La fecha de fin es obligatoria',
      invalid_type_error: 'Formato de fecha inválido',
    }).nullable(), // Permite ser null

  
  })
  
  .refine((data) => normalizeDate(data.startDate) >= today, {
    message: 'La fecha de inicio no puede ser en el pasado.',
    path: ['startDate'],
  })

  
  .refine(
    (data) => {
      if (data.endDate === null || data.endDate === undefined) {
        return true; //
      }
      
     
      if (normalizeDate(data.endDate) < today) {
         
      }
      
    
      return normalizeDate(data.endDate) > normalizeDate(data.startDate);
    },
    {
      message: 'La fecha de fin debe ser posterior a la fecha de inicio.',
      path: ['endDate'],
    }
  );

export type GoalFormType = z.infer<typeof GoalSchema>;