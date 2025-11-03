// metro.config.js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require("nativewind/metro");

const baseConfig = getDefaultConfig(__dirname);
const mergedConfig = mergeConfig(baseConfig, {});

// ✅ ESTO ES CORRECTO: Le dice a Metro que use NativeWind para procesar el CSS
module.exports = withNativeWind(mergedConfig, { input: "./src/global.css" });