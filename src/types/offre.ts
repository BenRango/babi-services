import type { DemandeMode, DemandeStatut, TypeDescription } from "@/types/demande";
import { BadgeArtisan, StatutKyc } from "@/types/user";

export enum OffreStatut {
  EN_ATTENTE = "en_attente",
  ACCEPTEE = "acceptee",
  REFUSEE = "refusee",
  EXPIREE = "expiree",
}

export interface OffrePrestataire {
  id: string;
  nom: string;
  telephone: string;
  statutKyc: StatutKyc;
  badge: BadgeArtisan;
}

export interface Offre {
  id: string;
  prestataire?: OffrePrestataire;
  prixProposeFcfa: number;
  delaiMinutes: number;
  message?: string | null;
  messageAudioUrl?: string | null;
  statut: OffreStatut;
  createdAt: string;
}

export interface CreerOffrePayload {
  demandeId: string;
  prixProposeFcfa: number;
  delaiMinutes: number;
  /** message OU audio requis (les deux peuvent coexister). */
  message?: string;
  audio?: { uri: string; mimeType?: string | null; fileName?: string | null };
}

export interface MesOffreDemande {
  id: string;
  client: { id: string; nom: string; telephone: string };
  categorie: string;
  picture_url?: string | null;
  typeDescription: TypeDescription;
  description?: string | null;
  audioUrl?: string | null;
  budgetMaxFcfa: number;
  commune?: string | null;
  mode: DemandeMode;
  statut: DemandeStatut;
  createdAt: string;
}

export interface MesOffre {
  id: string;
  demandeId: string;
  demande: MesOffreDemande;
  prixProposeFcfa: number;
  delaiMinutes: number;
  message?: string | null;
  messageAudioUrl?: string | null;
  statut: OffreStatut;
  createdAt: string;
}
