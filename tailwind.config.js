/** @type {import('tailwindcss').Config} */
const nativewind = require("nativewind/preset");

module.exports = {
  // Configura el Modo Oscuro para que use la clase CSS (.dark)
  darkMode: 'class', 

  // Usa el preset de NativeWind
  presets: [nativewind],
  
  // Rastrea todos los archivos donde se usarán clases de Tailwind
  content: [
    "./App.tsx",
    "./src/**/*.{js,jsx,ts,tsx,css}",
  ],

  theme: {
    extend: {
      colors: {
        // Mapeo de Colores Temáticos (Consumen las Variables CSS)
        // Esto crea clases como 'bg-background', 'border-primary', 'text-foreground', etc.
        'background': 'var(--background)',
        'foreground': 'var(--foreground)',
        
        'primary': {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        'secondary': {
          DEFAULT: 'var(--secondary)',
          // Asumiendo que el texto sobre secondary usa foreground por defecto, si no, defínelo aquí
        },
        
        'muted': {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        
        'accent': 'var(--accent)',
        'destructive': 'var(--destructive)',
        
        'border': 'var(--border)',
        'input': 'var(--input-background)', // Usado para 'bg-input'
        
        // Mapeo de Colores de Categorías (Hex)
        'pomodoro': '#ef4444',
        'ejercicio': '#22c55e',
        'estudio': '#3b82f6',
        'lectura': '#f59e0b',
        'meditacion': '#8b5cf6',
        'agua': '#06b6d4',
        
        // Mapeo de Colores de Gráficos
        'chart': {
           1: 'var(--chart-1)',
           2: 'var(--chart-2)',
           3: 'var(--chart-3)',
           4: 'var(--chart-4)',
           5: 'var(--chart-5)',
        },
      },
    },
  },
  plugins: [],
}