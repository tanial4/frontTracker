// src/screens/profile/EditProfileScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  launchImageLibrary,
  ImageLibraryOptions,
} from 'react-native-image-picker';

import InnerScreenLayout from '../../components/layout/InnerLayout';

import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { globalLayout, formComponentStyles } from '../../styles/GlobalStyles';
import { FormInput } from '../../components/forms/formInput';
import { Button } from '../../components/ui/button';
import { ProfileFormType, ProfileSchema } from '../../schemas/profileSchema';
import { ProfilePhotoPicker } from '../../components/forms/ProfilePhotoPicker';
import { api } from '../../services/apiClient';

// Lo que devuelve tu /users/me (según UsersService + publicUserSelect)
type ApiUserMe = {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
};

interface EditProfileScreenProps {
  navigation: any;
}

export function EditProfileScreen({ navigation }: EditProfileScreenProps) {
  const insets = useSafeAreaInsets();

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  

  const methods = useForm<ProfileFormType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      avatarUrl: undefined,
      fullName: '',
      bio: '',
    },
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    watch,
    reset,
    formState: { isValid, isSubmitting },
  } = methods;

  const maxBioLength = 150;
  const currentBioLength = watch('bio')?.length || 0;

  // 🔹 1. Cargar datos de /users/me y prellenar el form
  useEffect(() => {
    let isMounted = true;

    const fetchMe = async () => {
      try {
        setLoadingUser(true);
        setLoadError(null);

        const res = await api.get<ApiUserMe>('/users/me');
        if (!isMounted) return;

        const user = res.data;

        reset({
          avatarUrl: undefined, // cuando tengas URL real la pones aquí
          fullName: user.username, // si luego tienes profile.fullName, cámbialo
          bio: '', // si luego tienes profile.bio, la asignas aquí
        });
      } catch (err) {
        console.log('Error cargando /users/me en EditProfileScreen:', err);
        if (isMounted) {
          setLoadError('No se pudo cargar tu perfil.');
        }
      } finally {
        if (isMounted) setLoadingUser(false);
      }
    };

    fetchMe();

    return () => {
      isMounted = false;
    };
  }, [reset]);

  // 🔹 2. Guardar cambios → PATCH /users/me
  const onSubmit = async (data: ProfileFormType) => {
    try {
      // El backend espera UpdateUserDto con: fullName, avatarUrl, bio
      await api.patch('/users/me', {
        fullName: data.fullName,
        avatarUrl: data.avatarUrl ?? null,
        bio: data.bio ?? null,
      });

      Alert.alert('Perfil actualizado', 'Tus cambios se guardaron correctamente.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err: any) {
      console.log('Update profile error ->', err?.response?.data || err.message);
        Alert.alert('Error', 'No se pudo actualizar tu perfil. Intenta de nuevo.');
      
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleImageSelect = (onChange: (uri: string | undefined) => void) => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.7,
      includeBase64: false,
    };

    launchImageLibrary(options, (response: any) => {
      if (response.didCancel) {
        return;
      } else if (response.errorMessage) {
        Alert.alert('Error', 'No se pudo seleccionar la imagen.');
      } else if (response.assets && response.assets[0]?.uri) {
        onChange(response.assets[0].uri);
      } else {
        onChange(undefined);
      }
    });
  };

  return (
    <InnerScreenLayout
      title="Editar perfil"
      onBack={handleCancel}
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
          <FormProvider {...methods}>
            {/* FOTO DE PERFIL */}
            <View style={styles.sectionContainer}>
              <ProfilePhotoPicker
                name="avatarURL"
                fullName={methods.watch('fullName')}
                onImageSelect={handleImageSelect}
                isEditable={true}
              />
            </View>

            {/* LOADING / ERROR DEL PERFIL */}
            {loadingUser && (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color={COLORS.PRIMARY} />
                <Text style={styles.loadingText}>Cargando datos...</Text>
              </View>
            )}
            {loadError && !loadingUser && (
              <Text style={styles.errorText}>{loadError}</Text>
            )}

            {/* FORM PRINCIPAL */}
            <View style={styles.formCard}>
              <FormInput name="fullName" label="Nombre completo" />

              <FormInput
                name="bio"
                label="Biografía"
                multiline
                numberOfLines={4}
                placeholder="Describe tu pasión..."
                maxLength={maxBioLength}
                customInputStyle={styles.bioInput}
              />
              <Text style={styles.charCounter}>
                {currentBioLength}/{maxBioLength} caracteres
              </Text>
            </View>

            {/* ACCIONES */}
            <View style={styles.buttonContainer}>
              <Button
                onPress={handleCancel}
                style={styles.cancelButton}
                textStyle={styles.cancelButtonText}
              >
                Cancelar
              </Button>

              <Button
                onPress={handleSubmit(onSubmit)}
                style={styles.saveButton}
                textStyle={styles.saveButtonText}
                disabled={isSubmitting || !isValid || loadingUser}
                isLoading={isSubmitting}
              >
                Guardar cambios
              </Button>
            </View>
          </FormProvider>
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
    paddingBottom: 40,
    paddingHorizontal: 0,
    alignItems: 'center',
  },

  sectionContainer: {
    width: '90%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },

  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: -10,
  },
  loadingText: {
    marginLeft: 6,
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.ERROR_TEXT,
    marginBottom: 10,
  },

  formCard: {
    ...formComponentStyles.formCardBase,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    width: '95%',
    gap: 15,
    borderWidth: 0,
    shadowColor: COLORS.BACKGROUND_DEFAULT,
  },

  readOnlyField: {
    opacity: 0.7,
  },
  readOnlyHelperText: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
    marginTop: -15,
  },

  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingVertical: 10,
  },
  charCounter: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
    alignSelf: 'flex-end',
    marginTop: -27,
    marginBottom: 10,
    marginRight: 5,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 10,
    width: '100%',
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.INPUT_BACKGROUND,
    paddingVertical: 12,
    borderRadius: 8,
    borderColor: COLORS.BORDER_COLOR,
    borderWidth: 1,
  },
  cancelButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: COLORS.BACKGROUND_DEFAULT,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
