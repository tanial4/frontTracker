// src/screens/goals/CreateGoalScreen.tsx

import React, { useState } from 'react';
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
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { globalLayout } from '../../styles/GlobalStyles';
import InnerScreenLayout from '../../components/layout/InnerLayout';

import { CreateGoalForm } from '../../components/forms/CreateGoalForm';
import { GoalSchema, GoalFormType } from '../../schemas/createGoalSchema';
import { MOCK_CATEGORIES } from '../../data/Categories';
import { GOAL_TEMPLATES } from '../../data/GoalsTypes';
import { ActivityCategory, GoalTemplate } from '../../types/goal';
import { TemplateCard } from '../../components/goals/templateGoaldCard';
import { RootTabParamList, RouteStackHomeParamList } from '../../components/navigation/types';

type HomeNavProp = BottomTabNavigationProp<RouteStackHomeParamList, 'HomeMain'>;

interface CreateGoalScreenProps {
  onGoBack?: () => void;
  onGoalCreated?: (data: GoalFormType) => void;
}

export function CreateGoalScreen({
  onGoBack,
  onGoalCreated,
}: CreateGoalScreenProps) {
  const navigation = useNavigation<HomeNavProp>();

  const [selectedTemplate, setSelectedTemplate] = useState<
    GoalTemplate | undefined
  >(undefined);

  // RHF configurado para que isValid se actualice en tiempo real
  const methods = useForm<GoalFormType>({
    resolver: zodResolver(GoalSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      categoryId: '',
      targetType: 'DAILY',
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const allCategoriesTyped = MOCK_CATEGORIES as ActivityCategory[];
  const templatesToRender = GOAL_TEMPLATES as GoalTemplate[];

  const handleTemplateSelect = (template: GoalTemplate) => {
    setSelectedTemplate(template);
  };

  // 🔙 Handler centralizado de "volver"
  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      navigation.navigate('HomeMain');
    }
  };

  // ✅ Cuando se crea la meta
  const handleGoalCreatedInternal = (data: GoalFormType) => {
    if (onGoalCreated) {
      onGoalCreated(data);
    }
    // Después de crear, manda a Home
    navigation.navigate('HomeMain');
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
