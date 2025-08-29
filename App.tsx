import React from 'react';
import { StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      {/* 👇 Aquí va tu contenido personalizado */}
      <Text style={styles.title}>¡Hola Mundo!</Text>
      <Text style={styles.title}>Kaizen🫀</Text>
      <Text style={styles.subtitle}>Equipo 3 Grupo 34</Text>
      <Text style={styles.content}>Life Tracker es una aplicación diseñada para ayudarte a construir y mantener hábitos saludables, gestionar tus metas y mejorar tu productividad diaria. Integra un temporizador Pomodoro, registro de hábitos y metas, además de un sistema de rachas que fomenta la constancia.</Text>
      <Text style={styles.content}>Nuestro objetivo es ofrecer una experiencia ligera y motivadora, con recordatorios, estadísticas semanales y la opción de exportar tu progreso, de modo que puedas visualizar y compartir tus logros de forma clara y sencilla.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    color: '#666',
  },
  content: {
    fontSize: 13,
    textAlign: 'justify',
    color: '#010101',
    margin: 2,
    padding: 20
  }
});

export default App;

