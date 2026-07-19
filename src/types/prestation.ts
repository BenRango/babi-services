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
