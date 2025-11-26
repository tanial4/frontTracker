declare module 'axios' {
  const axios: any;
  export default axios;
}

declare module '@react-native-async-storage/async-storage' {
  const AsyncStorage: any;
  export default AsyncStorage;
}

declare module 'react-native-image-picker' {
  export const launchImageLibrary: any;
  export type ImageLibraryOptions = any;
}
