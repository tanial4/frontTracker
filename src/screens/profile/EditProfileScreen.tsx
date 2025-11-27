// src/screens/profile/EditProfileScreen.tsx

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
} from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';

import InnerScreenLayout from '../../components/layout/InnerLayout';

import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { globalLayout, formComponentStyles } from '../../styles/GlobalStyles';
import { FormInput } from '../../components/forms/formInput';
import { Button } from '../../components/ui/button';
import { ProfileFormType, ProfileSchema } from '../../schemas/profileSchema';
import { ProfilePhotoPicker } from '../../components/forms/ProfilePhotoPicker';

interface EditProfileScreenProps {
  navigation: any;
}

export function EditProfileScreen({ navigation }: EditProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const idUser = 'current-user-id'; // Aquí deberías obtener el ID del usuario actual

  const methods = useForm<ProfileFormType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      avatarURL: undefined,
      fullName: 'Usuario Demo',
      email: 'demo@ejemplo.com',
      bio: 'Apasionado por el desarrollo personal y la productividad. 🚀',
    },
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    watch,
    formState: { isValid, isSubmitting },
  } = methods;

  const onSubmit = (data: ProfileFormType) => {
    console.log('Datos de Perfil a actualizar:', data);
    // Aquí iría tu llamada a la API
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const maxBioLength = 150;
  const currentBioLength = watch('bio')?.length || 0;

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

            {/* FORM PRINCIPAL */}
            <View style={styles.formCard}>
              <FormInput name="fullName" label="Nombre completo" />

              <View style={styles.readOnlyField}>
                <FormInput
                  name="email"
                  label="Email"
                  editable={false}
                  placeholder="demo@ejemplo.com"
                />
                <Text style={styles.readOnlyHelperText}>
                  El email no se puede cambiar
                </Text>
              </View>

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
                onPress={() => handleSubmit(onSubmit)()}
                style={styles.saveButton}
                textStyle={styles.saveButtonText}
                disabled={isSubmitting || !isValid}
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
