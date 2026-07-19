import { Demande } from "@/types/demande";
import { Offre } from "@/types/offre";
import { Prestation } from "@/types/prestation";
import { PrestataireResume } from "@/types/prestataire";
import { Transaction, Wallet } from "@/types/wallet";

/**
 * Mini "backend" en mémoire : latence artificielle + état mutable partagé
 * entre les services, pour que les écrans se comportent déjà comme s'ils
 * parlaient à une vraie API. Basculer vers un vrai backend ne touchera
 * que ce fichier + les fonctions exportées de src/services/*.
 */

export const LATENCE_MS = 600;

export function delay<T>(value: T, ms: number = LATENCE_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const PRESTATAIRES_POOL: PrestataireResume[] = [
  {
    id: "presta-1",
    nom: "Konan Yves",
    metier: "Plombier certifié",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
    note: 4.9,
    nbAvis: 127,
    distanceKm: 1.2,
  },
  {
    id: "presta-2",
    nom: "Diabaté Ibrahim",
    metier: "Électricien",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&auto=format",
    note: 4.7,
    nbAvis: 89,
    distanceKm: 0.8,
  },
  {
    id: "presta-3",
    nom: "Mariam D.",
    metier: "Femme de ménage",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format",
    note: 4.8,
    nbAvis: 203,
    distanceKm: 2.1,
  },
  {
    id: "presta-4",
    nom: "Ouattara Mamadou",
    metier: "Menuisier",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&auto=format",
    note: 4.6,
    nbAvis: 64,
    distanceKm: 3.4,
  },
  {
    id: "presta-5",
    nom: "Yao Kouassi",
    metier: "Peintre",
    avatarUrl: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=200&h=200&fit=crop&auto=format",
    note: 4.5,
    nbAvis: 41,
    distanceKm: 2.7,
  },
];

export const demandes: Demande[] = [];
export const offres: Offre[] = [];
export const prestations: Prestation[] = [];

export const wallet: Wallet = { soldeFcfa: 86500, soldeBloqueFcfa: 0 };

export const transactions: Transaction[] = [
  { id: "trx-1", title: "Rechargement Wave", amount: 50000, date: "Hier", type: "credit" },
  { id: "trx-2", title: "Réparation plomberie – Konan Y.", amount: 13500, date: "28 juin", type: "debit" },
  { id: "trx-3", title: "Nettoyage – Mariam D.", amount: 16000, date: "25 juin", type: "debit" },
];

let idCounter = 0;
export function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}
