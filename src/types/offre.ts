import { PrestataireResume } from "@/types/prestataire";

export type StatutOffre = "en_attente" | "acceptee" | "refusee" | "expiree";

export interface Offre {
  id: string;
  demandeId: string;
  prestataire: PrestataireResume;
  prix: number;
  delaiHeures: number;
  message: string;
  statut: StatutOffre;
  dateEnvoi: string;
  recommandee?: boolean;
}
