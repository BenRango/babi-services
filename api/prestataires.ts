import { BadgeArtisan, StatutKyc } from "@/types/user";
import { apiClient } from "./client";

export interface PrestataireRecherche {
  id: string;
  nom: string;
  statutKyc: StatutKyc;
  badge: BadgeArtisan;
  communes: string[];
  categories: string[];
}

export interface FiltresPrestataires {
  categorie?: string;
  commune?: string;
}

export async function rechercherPrestataires(
  filtres?: FiltresPrestataires
): Promise<PrestataireRecherche[]> {
  const { data } = await apiClient.get<PrestataireRecherche[]>("/prestataires", { params: filtres });
  return data;
}
