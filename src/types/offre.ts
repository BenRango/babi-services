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
  message: string;
  statut: OffreStatut;
  createdAt: string;
}
