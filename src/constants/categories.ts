import { CategorieService } from "@/types/demande";
import { ImageSourcePropType } from "react-native";

export interface CategorieMeta {
  id: CategorieService;
  label: string;
  icon: ImageSourcePropType;
}

export const CATEGORIES: CategorieMeta[] = [
  { id: "plomberie", label: "Plomberie", icon: require("@/assets/icons/water-tap-plumber.svg") },
  { id: "electricite", label: "Électricité", icon: require("@/assets/icons/electricity-technology.svg") },
  { id: "menage", label: "Ménage", icon: require("@/assets/icons/menage.svg") },
  { id: "climatisation", label: "Climatisation", icon: require("@/assets/icons/breeze.svg") },
  { id: "peinture", label: "Peinture", icon: require("@/assets/icons/peinture.svg") },
  { id: "menuiserie", label: "Menuiserie", icon: require("@/assets/icons/carpenter.svg") },
];

export function categorieLabel(id: CategorieService): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function categorieIcon(id: CategorieService): ImageSourcePropType | undefined {
  return CATEGORIES.find((c) => c.id === id)?.icon;
}
