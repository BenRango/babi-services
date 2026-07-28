import { PrestataireResume } from "@/types/prestataire";
import { PRESTATAIRES_POOL, delay } from "./_mockData";

/** Encore utilisé par le chat mock (src/app/(client)/message) — pas branché sur le vrai backend. */
export async function getPrestataire(id: string): Promise<PrestataireResume> {
  const prestataire = PRESTATAIRES_POOL.find((p) => p.id === id);
  if (!prestataire) throw new Error("Prestataire introuvable");
  return delay(prestataire);
}
