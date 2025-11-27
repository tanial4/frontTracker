// src/components/forms/CreateGoalForm.tsx
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
import { CATEGORIES } from '../../data/Categories';

// Función auxiliar para calcular los valores iniciales
const getFormDefaults = (template?: GoalTemplate): GoalFormType => {
  return {
    title: template?.title || '',
    description: template?.description || '',
    categoryId: template?.categoryId || '',
    targetType:
      template && (template.targetType === 'WEEKLY' || template.targetType === 'DAILY')
        ? (template.targetType as any)
        : 'DAILY',
    startDate: new Date(),
    endDate: new Date(),
    // si tu GoalFormType tiene targetValue, lo dejamos caer aquí:
    // targetValue: template?.targetValue ?? null,
  };
};

interface CreateGoalFormProps {
  onCancel: () => void;
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
  allCategories,
}: CreateGoalFormProps) {
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isValid, isSubmitting },
  } = methods;

  const [uiGoalType, setUiGoalType] = useState<'DAILY' | 'WEEKLY'>(
    initialTemplate?.targetType === 'WEEKLY' ? 'WEEKLY' : 'DAILY'
  );

  // Cuando cambia la plantilla, reseteamos el form con sus valores
  useEffect(() => {
    const defaults = getFormDefaults(initialTemplate);
    reset(defaults);

    const newUiType: 'DAILY' | 'WEEKLY' =
      initialTemplate?.targetType === 'WEEKLY' ? 'WEEKLY' : 'DAILY';

    setUiGoalType(newUiType);
    setValue('targetType', newUiType, { shouldValidate: true });
  }, [initialTemplate, reset, setValue]);

  // Sincronizar el toggle de UI con RHF
  useEffect(() => {
    setValue('targetType', uiGoalType, { shouldValidate: true });
  }, [uiGoalType, setValue]);

  const isDisabled = !isValid || isSubmitting;

  const onSubmit = (data: GoalFormType) => {
    // Si quieres mapear a otro enum para backend, lo haces fuera (en CreateGoalScreen)
    console.log('[CreateGoalForm] Enviando payload:', data);
    onCreate(data);
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Meta personalizada</Text>

        {/* Nombre de la meta (AHORA title) */}
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

        {/* Categoría */}
        <FormSelect
          name="categoryId"
          label="Categoría *"
          placeholder="Selecciona una categoría"
          options={CATEGORIES}
        />

        {/* Tipo de meta (Diaria / Semanal) */}
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

        {/* Fechas */}
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

        {/* Botones */}
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
    textAlignVertical: 'top',
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
