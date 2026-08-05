import { Offre } from "@/types/offre";

export type CategorieService =
  | "plomberie"
  | "electricite"
  | "menage"
  | "climatisation"
  | "peinture"
  | "menuiserie"
  | "autres";

export enum DemandeMode {
  RECHERCHE = "recherche",
  POST_PUBLIC = "post_public",
}

export enum DemandeStatut {
  OUVERTE = "ouverte",
  EN_COURS = "en_cours",
  FERMEE = "fermee",
  ANNULEE = "annulee",
  EXPIREE = "expiree",
}

export enum TypeDescription {
  TEXT = "text",
  AUDIO = "audio",
}

export interface Demande {
  id: string;
  clientId: string;
  categorie: string;
  picture_url?: string | null;
  typeDescription: TypeDescription;
  description?: string | null;
  audioUrl?: string | null;
  budgetMaxFcfa: number;
  commune?: string | null;
  mode: DemandeMode;
  statut: DemandeStatut;
  expireAt: string | null;
  createdAt: string;
  offres: Offre[];
}
