import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { UseFormReturn } from 'react-hook-form';

import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { FormInput } from './formInput';
import { FormSelect } from './FormSelect';
import { Button } from '../ui/button';
import { GoalFormType } from '../../schemas/createGoalSchema';
import { GoalTemplate, ActivityCategory } from '../../types/goal';
import { TARGET_TYPE_OPTIONS } from '../../data/Options';
import { FormDate } from './FormDate';

// Función auxiliar para calcular los valores iniciales del formulario.
// Si se recibe una plantilla (template), pre-llenamos los campos para agilizar el proceso.
// Se añade lógica específica para 'daysPerWeek' si la plantilla es semanal.
const getFormDefaults = (template?: GoalTemplate): GoalFormType => {
  return {
    title: template?.title || '',
    description: template?.description || '',
    // Dejamos categoryId vacío intencionalmente para forzar al usuario a confirmar/elegir la categoría
    categoryId: '', 
    targetType:
      template && (template.targetType === 'WEEKLY' || template.targetType === 'DAILY')
        ? (template.targetType as any)
        : 'DAILY',
    startDate: new Date(),
    endDate: new Date(),
    // Si la plantilla es semanal, intentamos extraer la frecuencia (ej: 3 veces por semana)
    daysPerWeek:
      template?.targetType === 'WEEKLY' && (template as any).targetValue
        ? String((template as any).targetValue)
        : '',
  };
};

interface CreateGoalFormProps {
  onCancel: () => void;
  // Recibimos los métodos de useForm desde el padre para mantener el control fuera
  methods: UseFormReturn<GoalFormType>;
  allCategories: ActivityCategory[];
  initialTemplate?: GoalTemplate;
  onCreate: (data: GoalFormType) => void;
}

export function CreateGoalForm({
  onCancel,
  initialTemplate,
  methods,
  onCreate,
  allCategories
}: CreateGoalFormProps) {
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isValid, isSubmitting },
  } = methods;

  // Estado local para controlar visualmente el toggle de tipo de meta (Diaria vs Semanal).
  // Lo separamos para tener control inmediato de la UI antes de validar.
  const [uiGoalType, setUiGoalType] = useState<'DAILY' | 'WEEKLY'>(
    initialTemplate?.targetType === 'WEEKLY' ? 'WEEKLY' : 'DAILY'
  );

  // Efecto 1: Reseteo por cambio de Plantilla
  // Cuando cambia la plantilla seleccionada (o se limpia), reiniciamos el formulario
  // con los nuevos valores por defecto y actualizamos el toggle visual.
  useEffect(() => {
    const defaults = getFormDefaults(initialTemplate);
    reset(defaults);

    const newUiType: 'DAILY' | 'WEEKLY' =
      initialTemplate?.targetType === 'WEEKLY' ? 'WEEKLY' : 'DAILY';

    setUiGoalType(newUiType);
    // Forzamos la actualización en RHF inmediatamente
    setValue('targetType', newUiType, { shouldValidate: true });
  }, [initialTemplate, reset, setValue]);

  // Efecto 2: Sincronización Manual
  // Mantiene el valor del formulario (RHF) en sintonía con el estado local del toggle.
  useEffect(() => {
    setValue('targetType', uiGoalType, { shouldValidate: true });
  }, [uiGoalType, setValue]);

  const isDisabled = !isValid || isSubmitting;

  const onSubmit = (data: GoalFormType) => {
    // Aquí se podrían hacer transformaciones finales de datos antes de subir al padre
    console.log('[CreateGoalForm] Enviando payload:', data);
    onCreate(data);
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      // Permite cerrar el teclado al tocar fuera de los inputs
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Meta personalizada</Text>

        {/* Sección: Información Básica */}
        <FormInput
          name="title"
          label="Nombre de la meta *"
          placeholder="Ej: Correr 5km diarios"
        />

        <FormInput
          name="description"
          label="Descripción"
          placeholder="Describe tu meta y por qué es importante..."
          multiline
          numberOfLines={4}
          customInputStyle={styles.descriptionInput}
        />

        {/* Sección: Categoría */}
        <FormSelect
          name="categoryId"
          label="Categoría *"
          placeholder="Selecciona una categoría"
          // Mapeo de la estructura de base de datos a la estructura {label, value} del select
          options={allCategories.map((cat) => ({
            label: cat.name,
            value: cat.id,
          }))}
        />

        {/* Sección: Tipo de Meta (Toggle Visual) */}
        <Text style={styles.sectionLabel}>Tipo de meta *</Text>
        <View style={styles.goalTypeGroup}>
          {TARGET_TYPE_OPTIONS.map((option) => {
            const isActive = uiGoalType === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.goalTypeCard,
                  isActive && styles.goalTypeActive,
                ]}
                onPress={() =>
                  setUiGoalType(option.value as 'DAILY' | 'WEEKLY')
                }
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.goalTypeLabel,
                    isActive && styles.goalTypeLabelActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Input Condicional: Solo aparece si el tipo es SEMANAL.
            Pide la frecuencia (ej: 3 días a la semana). */}
        {uiGoalType === 'WEEKLY' && (
          <FormInput
            name="daysPerWeek"
            label="¿Cuántos días por semana quieres cumplir esta meta? *"
            placeholder="Ej: 3"
            keyboardType="numeric"
          />
        )}

        {/* Sección: Fechas */}
        <View style={styles.dateGroup}>
          <View style={styles.datePickerWrapper}>
            <FormDate
              name="startDate"
              label="Fecha de inicio *"
              placeholder="Selecciona la fecha de inicio"
              minimumDate={new Date()}
            />
          </View>

          <View style={styles.datePickerWrapper}>
            <FormDate
              name="endDate"
              label="Fecha de fin *"
              placeholder="Selecciona la fecha de fin"
              minimumDate={new Date()}
            />
          </View>
        </View>

        {/* Botones de Acción */}
        <View style={styles.buttonRow}>
          <Button
            onPress={onCancel}
            variant="ghost"
            style={styles.cancelButton}
            size="lg"
          >
            Cancelar
          </Button>

          <Button
            onPress={handleSubmit(onSubmit)}
            style={styles.createButton}
            size="lg"
            disabled={isDisabled}
            isLoading={isSubmitting}
          >
            Crear meta
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

// ---------------- ESTILOS ----------------

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 20,
  },
  descriptionInput: {
    minHeight: 100,
    textAlignVertical: 'top', // Alineación superior para textareas en Android
    paddingVertical: 10,
  },
  sectionLabel: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  dateGroup: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 10,
    marginBottom: 15,
  },
  datePickerWrapper: {
    flex: 1,
  },
  goalTypeGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  goalTypeCard: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    backgroundColor: COLORS.BUTTON_SECONDARY_BG,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
    minHeight: 20,
    justifyContent: 'center',
  },
  goalTypeActive: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY,
    borderWidth: 2,
  },
  goalTypeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  goalTypeLabelActive: {
    color: COLORS.BACKGROUND_DEFAULT,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.BUTTON_SECONDARY_BG,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
  },
  createButton: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 14,
    borderRadius: 8,
  },
});

export default CreateGoalForm;