export interface Client {
  id: string;
  nom: string;
  telephone: string;
  email?: string;
  avatarUrl: string;
  commune: string;
}

export enum UserRole {
  CLIENT = "client",
  PRESTATAIRE = "prestataire",
}

export type StatutKyc = "non_verifie" | "en_cours" | "verifie";

export enum BadgeArtisan {
  BRONZE = "bronze",
  ARGENT = "argent",
  OR = "or",
  DIAMANT = "diamant",
}

export interface User {
  id: string;
  nom: string;
  telephone: string;
  role: UserRole;
  statutKyc: StatutKyc;
  badge: BadgeArtisan;
  /** Réservé aux clients — null pour un prestataire. */
  commune: string | null;
  /** Réservé aux prestataires — null pour un client. */
  communes: string[] | null;
  /** Réservé aux prestataires — null pour un client. */
  categories: string[] | null;
}
