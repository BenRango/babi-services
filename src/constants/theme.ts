/**
 * Design tokens BabiServices — alignés sur le mockup MVP (BaBi Ecrans MVP_final).
 * Typo : Baloo 2 (titres) / Nunito Sans (texte & UI).
 */

import "@/global.css";

import { Platform, StyleSheet } from "react-native";

export const Colors = {
  light: {
    text: "#241A12",
    background: "#FBF7F1",
    backgroundElement: "#FFFFFF",
    backgroundSelected: "#FDEEDF",
    textSecondary: "#6B5F55",
  },
  dark: {
    text: "#ffffff",
    background: "#000000",
    backgroundElement: "#212225",
    backgroundSelected: "#2E3135",
    textSecondary: "#B0B4BA",
  },
  brand: {
    orange: "#EC7412",
    vert: "#1E8E3E",
    encre: "#241A12",
    fond: "#FBF7F1",
    tintOr: "#FDEEDF",
    tintVert: "#E5F4E8",
  },
  /** @deprecated utiliser Colors.brand — conservé le temps de migrer les écrans qui l'utilisent encore */
  orange: {
    text: "#EC7412",
    background: "#FDEEDF",
    border: "#EC7412",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = {
  title: "Baloo2_700Bold",
  titleSemiBold: "Baloo2_600SemiBold",
  titleMedium: "Baloo2_500Medium",
  body: "NunitoSans_400Regular",
  bodyMedium: "NunitoSans_600SemiBold",
  bodyBold: "NunitoSans_700Bold",
  /** @deprecated conservé pour themed-text.tsx (composant template Expo, hors périmètre client) */
  mono: Platform.select({ ios: "ui-monospace", default: "monospace" }),
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radii = {
  sm: 12,
  md: 18,
  lg: 24,
} as const;

export const BottomTabInset = 0;
export const MaxContentWidth = 800;
export const styles = StyleSheet.create({
  container: {
    padding: 25,
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    padding: 20,
    borderRadius: 15,
    borderColor: "#6e6e6e",
    backgroundColor: "#e9e9e9",
  },
  inputtouch: {
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.brand.orange,
  },
  erreur: {
    color: "red",
    marginTop: 4,
  },
  placeholder: {
    color: "#6e6e6e",
  },
});
