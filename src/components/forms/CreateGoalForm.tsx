import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { UseFormReturn } from 'react-hook-form';

import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { FormInput } from './formInput';
import { FormSelect } from './FormSelect';
import { Button } from '../ui/button';
import { GoalFormType } from '../../schemas/createGoalSchema';
import { GoalTemplate } from '../../types/goal';
import { TARGET_TYPE_OPTIONS } from '../../data/Options';
import { CATEGORIES } from '../../data/Categories';
import { FormDate } from './FormDate';

// Función auxiliar para calcular los valores iniciales.
// Si recibimos una plantilla (template), pre-llenamos los campos para agilizar la creación.
// Si no, devolvemos valores por defecto limpios.
const getFormDefaults = (template?: GoalTemplate): GoalFormType => {
  return {
    title: template?.title || '',
    description: template?.description || '',
    categoryId: template?.categoryId || '',
    // Aseguramos que el tipo de objetivo sea válido según nuestras opciones de UI
    targetType:
      template && (template.targetType === 'WEEKLY' || template.targetType === 'DAILY')
        ? (template.targetType as any)
        : 'DAILY',
    startDate: new Date(),
    endDate: new Date(),
  };
};
 
interface CreateGoalFormProps {
  onCancel: () => void;
  // Pasamos todos los métodos del hook useForm desde el componente padre
  methods: UseFormReturn<GoalFormType>;
  allCategories: any[];
  initialTemplate?: GoalTemplate;
  onCreate: (data: GoalFormType) => void;
}

export function CreateGoalForm({
  onCancel,

  initialTemplate,
  methods,
  onCreate,
}: CreateGoalFormProps) {
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isValid, isSubmitting },
  } = methods;

  // Estado local para manejar visualmente el toggle de tipo de meta (Diaria vs Semanal).
  // Lo separamos del estado del formulario para tener control inmediato sobre la UI
  // y luego sincronizamos.
  const [uiGoalType, setUiGoalType] = useState<'DAILY' | 'WEEKLY'>(
    initialTemplate?.targetType === 'WEEKLY' ? 'WEEKLY' : 'DAILY'
  );

  // Efecto: Cuando cambia la plantilla seleccionada (o se limpia)
  // reseteamos el formulario completo con los nuevos valores por defecto.
  useEffect(() => {
    const defaults = getFormDefaults(initialTemplate);
    reset(defaults);

    const newUiType: 'DAILY' | 'WEEKLY' =
      initialTemplate?.targetType === 'WEEKLY' ? 'WEEKLY' : 'DAILY';

    setUiGoalType(newUiType);
    // Forzamos la validación inmediata al setear el valor
    setValue('targetType', newUiType, { shouldValidate: true });
  }, [initialTemplate, reset, setValue]);

  // Efecto: Sincronización manual.
  // Cada vez que el usuario toca el botón de tipo de meta (uiGoalType),
  // actualizamos el valor real en React Hook Form.
  useEffect(() => {
    setValue('targetType', uiGoalType, { shouldValidate: true });
  }, [uiGoalType, setValue]);

  const isDisabled = !isValid || isSubmitting;

  const onSubmit = (data: GoalFormType) => {
    // Lógica de mapeo para el backend.
    // El backend distingue entre 'DAILY' y 'COUNT' (para metas numéricas/semanales),
    // mientras que en la UI lo mostramos como 'Semanal'.
    type BackendTargetType = 'DAILY' | 'COUNT';

    const targetTypeBE: BackendTargetType =
      uiGoalType === 'DAILY' ? 'DAILY' : 'COUNT';

    const finalPayload: GoalFormType = {
      ...data,
      targetType: targetTypeBE,
    };

    console.log('[CreateGoalForm] Enviando payload:', finalPayload);
    onCreate(finalPayload);
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      // Permite cerrar el teclado si se toca fuera de un input
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Meta personalizada</Text>

        {/* Sección 1: Información básica */}
        <FormInput
          name="name"
          label="Nombre de la racha *"
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

        {/* Sección 2: Categorización */}
        <FormSelect
          name="categoryId"
          label="Categoría *"
          placeholder="Selecciona una categoría"
          options={CATEGORIES}
        />

        {/* Sección 3: Selector de frecuencia (Toggle tipo tarjeta) */}
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

        {/* Sección 4: Definición de fechas */}
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

        {/* Sección 5: Acciones del formulario */}
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
    textAlignVertical: 'top', // Alinea el texto arriba en Android
    paddingVertical: 10,
  },
  sectionLabel: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 10,
    fontWeight: 'bold',
  },

  // Agrupación de fechas en fila
  dateGroup: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 10,
    marginBottom: 15,
  },
  datePickerWrapper: {
    flex: 1,
  },

  // Estilos para el selector tipo tarjeta
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

  // Botones inferiores
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