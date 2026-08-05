import type { DemandeMode, DemandeStatut, TypeDescription } from "@/types/demande";
import { PrestataireResume } from "@/types/prestataire";

export type StatutPrestation = "confirmee" | "en_route" | "en_cours" | "terminee";

export interface EtapePrestation {
  statut: StatutPrestation;
  horodatage: string;
}

export interface Prestation {
  id: string;
  demandeId: string;
  offreId: string;
  statut: StatutPrestation;
  codeConfirmation: string;
  prestataire: PrestataireResume;
  montant: number;
  paiementLibere: boolean;
  historique: EtapePrestation[];
}

export interface PrestationPersonne {
  id: string;
  nom: string;
  telephone: string;
}

export interface PrestationDemandeResume {
  id: string;
  categorie: string;
  picture_url: string | null;
  typeDescription: TypeDescription;
  description?: string | null;
  audioUrl?: string | null;
  budgetMaxFcfa: number;
  commune: string | null;
  mode: DemandeMode;
  statut: DemandeStatut;
}

export interface PrestationOffreResume {
  id: string;
  demande: PrestationDemandeResume;
  prixProposeFcfa: number;
  delaiMinutes: number;
  message?: string | null;
  messageAudioUrl?: string | null;
}

/**
 * Prestation réelle telle que renvoyée par GET /prestations/mes-prestations et GET /prestations/:id,
 * utilisable côté client comme côté prestataire (mêmes endpoints, accès filtré côté serveur).
 * `codeConfirmation` n'est présent que pour le client concerné, et seulement tant que
 * statut !== "terminee" — toujours absent pour le prestataire.
 */
export interface PrestationDetail {
  id: string;
  offreId: string;
  offre: PrestationOffreResume;
  clientId: string;
  client: PrestationPersonne;
  prestataireId: string;
  prestataire: PrestationPersonne;
  statut: StatutPrestation;
  codeConfirmation?: string;
  montantFcfa: number;
  commissionFcfa: number;
  paiementLibere: boolean;
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
}
