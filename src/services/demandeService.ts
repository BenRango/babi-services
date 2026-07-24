import { DemandeStatut } from "@/types/demande";
import { delay, demandes } from "./_mockData";

/**
 * Mock encore utilisé nulle part dans l'UI (pas de bouton "annuler" branché) —
 * la création réelle passe désormais par api/demandes.ts::createDemande.
 */
export async function annulerDemande(id: string): Promise<void> {
  const demande = demandes.find((d) => d.id === id);
  if (!demande) throw new Error("Demande introuvable");
  demande.statut = DemandeStatut.ANNULEE;
  return delay(undefined, 400);
}
