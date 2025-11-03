/** @type {import('tailwindcss').Config} */

// 🚨 1. Importar el preset de NativeWind (Crucial para el funcionamiento) 🚨
const nativewind = require("nativewind/preset"); 

module.exports = {
  // Configuración del Modo Oscuro basada en la clase CSS (.dark)
  darkMode: 'class', 

  // 🚨 2. Usar el preset de NativeWind 🚨
  presets: [nativewind], 
  
  // Rutas donde Tailwind debe buscar las clases para generarlas
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx,css}", // Rastreo completo de src/
    "./components/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    // La propiedad 'extend' fusiona tu configuración con la de Tailwind, no la reemplaza
    extend: {
      colors: {
        // Mapeo de Colores Temáticos (Consumen las Variables CSS)
        // Esto crea clases como 'bg-background', 'text-foreground', 'border-border', etc.
        'background': 'var(--background)',
        'foreground': 'var(--foreground)',
        
        'primary': {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        'secondary': {
          DEFAULT: 'var(--secondary)',
        },
        
        'muted': {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        
        'accent': 'var(--accent)',
        'destructive': 'var(--destructive)',
        
        'border': 'var(--border)',
        'input': 'var(--input-background)',
        
        // Mapeo de Colores de Categorías (Hex)
        'pomodoro': '#ef4444',
        'ejercicio': '#22c55e',
        'estudio': '#3b82f6',
        'lectura': '#f59e0b',
        'meditacion': '#8b5cf6',
        'agua': '#06b6d4',
        
        // Mapeo de Colores de Gráficos (Consumen las Variables CSS)
        'chart': {
           1: 'var(--chart-1)',
           2: 'var(--chart-2)',
           3: 'var(--chart-3)',
           4: 'var(--chart-4)',
           5: 'var(--chart-5)',
        },
      },
      
      // Mapeo de Border Radius y Font Size (Basado en la información adicional que proporcionaste)
      borderRadius: {
        'lg': '0.625rem', // Para un radio de 10px
      },
      fontSize: {
        // Establece una base para que 'text-sm' sea 14px, si es necesario
        'sm': ['14px', { lineHeight: '20px' }],
      },
    },
  },
  plugins: [],
};