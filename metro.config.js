// metro.config.js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  transformer: {
    // 👇 fuerza la ruta correcta del registry de assets
    assetRegistryPath: require.resolve('react-native/Libraries/Image/AssetRegistry'),
  },
};

module.exports = mergeConfig(defaultConfig, config);
