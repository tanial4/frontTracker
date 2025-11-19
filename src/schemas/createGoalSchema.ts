import { z } from 'zod';

// Definimos la fecha actual al inicio para usarla como mínimo en la validación
const today = new Date();
today.setHours(0, 0, 0, 0); // Establecemos la hora a medianoche para solo comparar el día

export const GoalSchema = z.object({
  // Campos obligatorios
  name: z.string().min(3, "El nombre de la meta es obligatorio."),
  categoryId: z.string().min(1, "Selecciona una categoría."),

  description: z.string().optional(),
  
  // 🚨 1. VALIDACIÓN DE FECHA DE INICIO 🚨
  startDate: z.date({
    required_error: "La fecha de inicio es obligatoria",
    invalid_type_error: "Formato de fecha inválido",
  })
    // Debe ser igual o mayor a la fecha actual (hoy)
    .min(today, { message: "La fecha de inicio no puede ser en el pasado." }),
  
  // 2. FECHA DE FIN (Opcional y con validación condicional)
  endDate: z.date({
    invalid_type_error: "Formato de fecha inválido",
  })
    .nullable()
    .optional(),
  
  targetType: z.string(),
})
// 🚨 3. VALIDACIÓN CONDICIONAL: Fecha de fin > Fecha de inicio 🚨
.refine((data) => {
    // Solo si el usuario ha seleccionado una fecha de fin
    if (data.endDate) {
        // La fecha de fin debe ser estrictamente posterior (>).
        // Si son el mismo día, permite el error.
        return data.endDate > data.startDate;
    }
    return true;
}, {
    message: "La fecha de fin debe ser posterior a la fecha de inicio.",
    path: ["endDate"], // Muestra el error junto al campo endDate
});

export type GoalFormType = z.infer<typeof GoalSchema>;