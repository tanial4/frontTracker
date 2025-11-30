// src/screens/goals/CreateGoalScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';


import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { globalLayout } from '../../styles/GlobalStyles';
import InnerScreenLayout from '../../components/layout/InnerLayout';

import { CreateGoalForm } from '../../components/forms/CreateGoalForm';
import { GoalSchema, GoalFormType } from '../../schemas/createGoalSchema';

import { GOAL_TEMPLATES } from '../../data/GoalsTypes';
import {  ActivityCategory, GoalTemplate } from '../../types/goal';

import { createGoal } from '../../services/goalsApi';
import TemplateCard from '../../components/goals/templateGoaldCard';
import { CategoryResponse, listCategories } from '../../services/categoriesApi';



interface CreateGoalScreenProps {
  onGoBack?: () => void;
  onGoalCreated?: (data: GoalFormType) => void;
}

export function CreateGoalScreen({
  onGoBack,
  onGoalCreated,
}: CreateGoalScreenProps) {
  const navigation = useNavigation();

  const [selectedTemplate, setSelectedTemplate] = useState<
    GoalTemplate | undefined
  >(undefined);

  const methods = useForm<GoalFormType>({
    resolver: zodResolver(GoalSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      categoryId: '',
      targetType: 'DAILY',
      startDate: new Date(),
      endDate: new Date(),
      daysPerWeek:""
    },
  });

  
  const templatesToRender = GOAL_TEMPLATES as GoalTemplate[];

  const handleTemplateSelect = (template: GoalTemplate) => {
    setSelectedTemplate(template);
  };

const [categories, setCategories] = useState<CategoryResponse[]>([]);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const data = await listCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error cargando categorías:', err);
    }
  };

  fetchCategories();
}, []);

const allCategoriesTyped: ActivityCategory[] = categories.map((c) => ({
  id: c.id,
  name: c.name,
  color: COLORS.PRIMARY,
}));

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      
      (navigation as any).goBack()
    }
  };

  const handleGoalCreatedInternal = async (data: GoalFormType) => {
  try {
    console.log('Goal form data:', data);

    // 👇 calcular targetValue según el tipo
    let targetValue: number | null = null;

    if (data.targetType === 'WEEKLY') {
      const n = Number(data.daysPerWeek);
      if (!n || n < 1 || !Number.isFinite(n)) {
        console.warn('Debes indicar cuántos días por semana (>= 1)');
        return; // o muestra un toast/alert y no envíes nada
      }
      targetValue = n;
    }

    const payload = {
      title: data.title,
      description: data.description || undefined,
      categoryId: data.categoryId ,
      targetType: data.targetType,  // 'DAILY' o 'WEEKLY'
      targetValue,                  // 👈 solo número para WEEKLY, null para DAILY
      startDate: data.startDate.toISOString(),
      endDate: data.endDate ? data.endDate.toISOString() : null,
      isArchived: false,
    } as const;

    console.log('Payload enviado a /goals:', payload);

    const created = await createGoal(payload);
    console.log('Goal creada en backend:', created);

    if (onGoalCreated) {
      onGoalCreated(data);
    }

    (navigation as any).goBack()
  } catch (error: any) {
    console.error(
      'Error creando meta:',
      error?.response?.data || error.message || error,
    );
  }
};


  return (
    <InnerScreenLayout
      title="Crear nueva meta"
      onBack={handleGoBack}
      containerStyle={styles.mainContainer}
    >
      <KeyboardAvoidingView
        style={globalLayout.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Plantillas recomendadas */}
          <Text style={styles.sectionHeading}>Recomendaciones</Text>

          <View style={styles.cardGrid}>
            {templatesToRender.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                allCategories={allCategoriesTyped}
                isActive={selectedTemplate?.id === template.id}
                onSelect={() => handleTemplateSelect(template)}
              />
            ))}
          </View>

          {/* 2. Formulario de meta personalizada */}
          <View style={styles.formContainer}>
            <FormProvider {...methods}>
              <CreateGoalForm
                methods={methods}
                onCancel={handleGoBack}
                onCreate={handleGoalCreatedInternal}
                initialTemplate={selectedTemplate}
                allCategories={allCategoriesTyped}
              />
            </FormProvider>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </InnerScreenLayout>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginTop: 20,
    marginBottom: 15,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
});

export default CreateGoalScreen;
