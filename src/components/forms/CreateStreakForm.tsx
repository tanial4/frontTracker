// src/components/forms/CreateStreakForm.tsx
import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { UseFormReturn } from 'react-hook-form';

import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { FormInput } from './formInput';
import { FormDate } from './FormDate';
import { Button } from '../ui/button';
import { StreakFormType } from '../../schemas/createStreakSchema';
import { streakBackEnd } from '../../types/streak';

interface CreateStreakFormProps {
  onCancel: () => void;
  methods: UseFormReturn<StreakFormType>;
  onCreate: (data: streakBackEnd) => void;
}

// Valores por defecto del formulario
const getFormDefaults = (): StreakFormType => {
  const todayISO = new Date().toISOString();

  return {
    title: '',
    description: '',
    startdate: todayISO,
    endDate: todayISO,
  };
};

export function CreateStreakForm({
  onCancel,
  methods,
  onCreate,
}: CreateStreakFormProps) {
  const {
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting },
  } = methods;

  useEffect(() => {
    reset(getFormDefaults());
  }, [reset]);

  const isDisabled = !isValid || isSubmitting;

  const onSubmit = (data: StreakFormType) => {
    // Ajustamos/limpiamos un poco antes de enviar
    const payload: streakBackEnd = {
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      startdate: data.startdate,
      endDate: data.endDate || undefined,
    };

    console.log('[CreateStreakForm] Enviando payload:', payload);
    onCreate(payload);
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Nueva racha</Text>

        {/* Información básica */}
        <FormInput
          name="title"
          label="Nombre de la racha *"
          placeholder="Ej: Meditar todos los días"
        />

        <FormInput
          name="description"
          label="Descripción"
          placeholder="Describe tu racha y por qué es importante..."
          multiline
          numberOfLines={4}
          customInputStyle={styles.descriptionInput}
        />

        {/* Fechas */}
          <View style={styles.datePickerWrapper}>
            <FormDate
              name="startdate"
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
            Crear racha
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}


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
  dateGroup: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 10,
    marginBottom: 15,
  },
  datePickerWrapper: {
    flex: 1,
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

export default CreateStreakForm;
