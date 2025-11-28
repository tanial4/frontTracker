// src/screens/streaks/CreateStreakScreen.tsx

import React from 'react';
import {
  View,
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

// Formulario de creación de streak
import { CreateStreakForm} from '../../components/forms/CreateStreakForm';

// Schema y tipo del formulario de streak
import { StreakSchema, StreakFormType } from '../../schemas/createStreakSchema';

// Tipos de navegación (ajusta la ruta si la tuya es distinta)
import { RouteStackHomeParamList, RouteStackStatsParamList } from '../../components/navigation/types';
import { streakBackEnd } from '../../types/streak';
import { createStreak } from '../../services/streakApi';

// Servicio para crear streak en el backend (ajusta la ruta si es otra)

type HomeNavProp = BottomTabNavigationProp<RouteStackStatsParamList, 'StatsMain'>;

interface CreateStreakScreenProps {
  // Permite inyectar un handler externo si esta pantalla se usa en un flujo embebido
  onGoBack?: () => void;
  onStreakCreated?: (data: streakBackEnd) => void;
}

/**
 * Pantalla para crear una nueva racha.
 * Mantiene el mismo patrón visual y de estructura que CreateGoalScreen,
 * pero simplificado (no hay plantillas ni categorías).
 */
export function CreateStreakScreen({
  onGoBack,
  onStreakCreated,
}: CreateStreakScreenProps) {
  const navigation = useNavigation<HomeNavProp>();

  /**
   * Configuración del formulario con React Hook Form + Zod.
   * Se usa el StreakSchema que valida:
   *  - título obligatorio
   *  - fechas válidas en formato string ISO
   *  - startdate no puede ser pasado
   *  - endDate debe ser posterior a startdate
   */
  const methods = useForm<StreakFormType>({
    resolver: zodResolver(StreakSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      startdate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    },
  });

  /**
   * Maneja la navegación al pulsar "Back".
   * Si se pasó un handler externo onGoBack, lo usamos,
   * si no, regresamos a HomeMain.
   */
  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      navigation.navigate('StatsMain');
    }
  };

  /**
   * Handler que se ejecuta cuando el formulario dispara onCreate.
   * Recibe un payload ya adaptado a la interfaz streakBackEnd,
   * y lo envía al backend mediante createStreak.
   */
  const handleStreakCreatedInternal = async (payload: streakBackEnd) => {
    try {
      console.log('Payload enviado a /streaks:', payload);

      const created = await createStreak(payload);
      console.log('Streak creada en backend:', created);

      if (onStreakCreated) {
        onStreakCreated(payload);
      }

      navigation.navigate('StatsMain');
    } catch (error: any) {
      console.error(
        'Error creando racha:',
        error?.response?.data || error.message || error,
      );
    }
  };

  return (
    <InnerScreenLayout
      title="Crear nueva racha"
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
          {/* En este caso no tenemos plantillas ni tarjetas recomendadas,
             por lo que la pantalla se centra en el formulario básico. */}
          <View style={styles.formContainer}>
            <FormProvider {...methods}>
              <CreateStreakForm
                methods={methods}
                onCancel={onGoBack || handleGoBack}
                onCreate={handleStreakCreatedInternal}
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
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
});

export default CreateStreakScreen;
