const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require("nativewind/metro");

/**
 * Metro configuration
 * @type {import('metro-config').MetroConfig}
 */

// 1. Obtén la configuración base de React Native
const baseConfig = getDefaultConfig(__dirname);

// 2. Define cualquier configuración personalizada que necesites
const customConfig = {
  // Aquí puedes agregar cualquier configuración de Metro, pero no NativeWind.
};

// 3. Fusiona la configuración base con tu configuración personalizada
const mergedConfig = mergeConfig(baseConfig, customConfig);

// 4. Aplica NativeWind al objeto de configuración FINAL
// La función withNativeWind(config, options) debe usarse para envolver todo.
module.exports = withNativeWind(mergedConfig, { input: "./src/global.css" });