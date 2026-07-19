import { CategorieService } from "@/types/demande";

export interface PrestataireResume {
  id: string;
  nom: string;
  avatarUrl: string;
  note: number;
  nbAvis: number;
  distanceKm: number;
  metier: string;
  categorie: CategorieService;
  tarifHoraire: number;
}
