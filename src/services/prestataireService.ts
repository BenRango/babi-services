import { PrestataireResume } from "@/types/prestataire";
import { PRESTATAIRES_POOL, delay } from "./_mockData";

export async function listPrestatairesRecommandes(): Promise<PrestataireResume[]> {
  return delay(PRESTATAIRES_POOL);
}
