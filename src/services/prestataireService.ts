import { CategorieMeta, CATEGORIES } from "@/constants/categories";
import { CategorieService } from "@/types/demande";
import { PrestataireResume } from "@/types/prestataire";
import { PRESTATAIRES_POOL, delay } from "./_mockData";

export async function listPrestatairesRecommandes(): Promise<PrestataireResume[]> {
  return delay(PRESTATAIRES_POOL);
}

export async function listPrestatairesByCategorie(categorie: CategorieService): Promise<PrestataireResume[]> {
  return delay(PRESTATAIRES_POOL.filter((p) => p.categorie === categorie));
}

export async function getPrestataire(id: string): Promise<PrestataireResume> {
  const prestataire = PRESTATAIRES_POOL.find((p) => p.id === id);
  if (!prestataire) throw new Error("Prestataire introuvable");
  return delay(prestataire);
}

export async function listCategoriesAvecCompte(): Promise<(CategorieMeta & { nbArtisans: number })[]> {
  return delay(
    CATEGORIES.map((cat) => ({
      ...cat,
      nbArtisans: PRESTATAIRES_POOL.filter((p) => p.categorie === cat.id).length,
    }))
  );
}
