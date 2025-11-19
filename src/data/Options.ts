import { SelectOption } from "../components/forms/FormSelect";


export const TIME_OPTIONS: SelectOption[] = [
    { label: '08:00 a.m.', value: '08:00' },
    { label: '09:00 a.m.', value: '09:00' },
    { label: '10:00 a.m.', value: '10:00' },
    { label: '11:00 a.m.', value: '11:00' },
    { label: '12:00 p.m.', value: '12:00' },
    { label: '01:00 p.m.', value: '13:00' }, // Usamos formato 24h en el valor para el backend
    { label: '02:00 p.m.', value: '14:00' },
    { label: '03:00 p.m.', value: '15:00' },
    { label: '04:00 p.m.', value: '16:00' },
    { label: '05:00 p.m.', value: '17:00' },
    { label: '06:00 p.m.', value: '18:00' },
    { label: '07:00 p.m.', value: '19:00' },
    { label: '08:00 p.m.', value: '20:00' },
    { label: '09:00 p.m.', value: '21:00' },
];

export const UNIT_OPTIONS: SelectOption[] = [
    { label: 'Horas', value: 'Horas' },
    { label: 'Minutos', value: 'Minutos' },
    { label: 'Veces', value: 'Veces' },
    { label: 'Páginas', value: 'Páginas' },
    { label: 'Unidades', value: 'Unidades' }, // Opción genérica si no aplica ninguna de las anteriores
    { label: 'Kilómetros', value: 'Kilómetros' }, // Común para ejercicio
    { label: 'Pasos', value: 'Pasos' },         // Común para ejercicio
];

export const TARGET_TYPE_OPTIONS: SelectOption[] = [
    { value: 'DAILY', label: 'Diaria'},
    { value: 'WEEKLY', label: 'Semanal'},
];