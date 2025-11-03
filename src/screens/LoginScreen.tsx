import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Platform, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '../components/forms/formInput'; 
import { Button } from '../components/ui/button'; 
import { cn } from '../lib/utils';

import '../global.css'; 
import { Flame } from 'lucide-react-native'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { LoginFormType, LoginSchema } from '../schemas/logInSchema';

type AuthStatus = 'loggedOut' | 'signedIn' | 'signingUp' | 'recovery';

export default function LoginScreen() {
    const insets = useSafeAreaInsets();
    
    const methods = useForm<LoginFormType>({
        resolver: zodResolver(LoginSchema),
        defaultValues: { email: '', password: '' },
        mode: 'onBlur', 
    });

    const { handleSubmit } = methods;

    const [localAuthState, setLocalAuthState] = useState<AuthStatus>('loggedOut'); 
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = (data: LoginFormType) => {
        setIsLoading(true);
        setTimeout(() => {
            setLocalAuthState('signedIn'); 
            setIsLoading(false);
        }, 1000);
    };

    const handleSwitchToSignup = () => setLocalAuthState('signingUp');
    const handleForgotPassword = () => setLocalAuthState('recovery');
    const handleDemoLogin = () => console.log("Iniciando sesión como Demo");

    const isSubmitting = methods.formState.isSubmitting || isLoading;

    return (
        <View 
            className="flex-1 bg-background"
            style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
        >
            <KeyboardAvoidingView 
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View className="flex-1 items-center px-6 pt-16 pb-10"> 
                    <View className="items-center mb-10 bg-[#ff0000]" style={{ backgroundColor: '#ff0000' }}>
                        <View className="w-16 h-16 rounded-2xl bg-black items-center justify-center mb-4 shadow-sm">
                            <Flame size={32} color="#00ff00" />
                        </View><Text className="text-[22px] font-bold text-foreground mb-1">¡Bienvenido de vuelta!</Text><Text className="text-muted-foreground text-base text-center">Continúa con tus rachas junto a tus amigos</Text>
                    </View>
                    <View 
                        className="w-full max-w-sm border border-border bg-background rounded-xl p-6 shadow-lg"
                    >
                        <FormProvider {...methods}>
                            <View className="space-y-4"> 
                                <FormInput name="email" label="Email" keyboardType="email-address" autoCapitalize="none"/>
                                <FormInput name="password" label="Contraseña" isPassword/>
                                <Button 
                                  onPress={handleSubmit(onSubmit)} 
                                  variant="default"
                                  className={cn("w-full mt-4 bg-muted border border-border", { "opacity-50": isSubmitting })}
                                  disabled={isSubmitting}
                                  loading={isSubmitting} 
                              >
                                  <Text className="text-primary-foreground font-semibold text-base">
                                      Iniciar Sesión
                                  </Text>
                              </Button>
                              <View className="flex flex-col items-end pt-8 space-y-6">
                                  <TouchableOpacity
                                      onPress={handleForgotPassword}
                                      className="block self-end"
                                  >
                                      <Text className="font-medium no-underline text-primary text-sm">
                                          ¿Olvidaste tu contraseña?
                                      </Text>
                                  </TouchableOpacity>
                              </View>
                            </View>
                        </FormProvider>
                    </View>
                    <View className="mt-8 items-center">
                      <View className="flex items-center justify-center pt-4">
                        <Text className="text-sm text-muted-foreground">
                            ¿No tienes cuenta?
                            <Text 
                                onPress={handleSwitchToSignup} 
                                className="font-medium text-primary ml-1"
                            >
                              Regístrate
                            </Text>
                        </Text>
                    </View>
                    </View>
                    <View className="mt-12 w-full max-w-sm rounded-xl border border-border bg-input-background p-4 shadow-sm">
                        <Text className="text-foreground font-medium mb-3 text-center">
                            Demo rápido:
                        </Text>
                        <Button 
                            onPress={handleDemoLogin} 
                            variant="secondary"
                            className="w-full bg-secondary border border-border"
                        >
                            <Text className="text-foreground font-semibold text-base">
                                Entrar como Demo
                            </Text>
                        </Button>
                    </View>

                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
};