/**
 * App Configuration
 * * Static configuration for Expo/Expo Application Services (EAS).
 * Environment variables are set via eas env commands and read at runtime.
 */

/** @type {import('expo/config/Config').ExpoConfig} */
const config = {
  name: "BagresAPP",
  slug: "BagresAPP",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/android-icon-foreground.png",
      backgroundImage: "./assets/android-icon-background.png",
      monochromeImage: "./assets/android-icon-monochrome.png"
    },
    package: "com.bagresapp"
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  // Plugins agregados para que las dependencias nativas funcionen fuera de Expo Go
  plugins: [
    "expo-font",
    "@react-native-community/datetimepicker"
  ],
  extra: {
    eas: {
      projectId: "caad28b3-cbd1-4af1-acb7-39e428ec1ba7"
    },
    supabaseUrl: "https://xjdstgxxkdhubpdzitut.supabase.co",
    supabaseAnonKey: "sb_publishable_x5Vb4XHbpP95jothicdfaQ_p88q_aIr",
  }
};

export default config;