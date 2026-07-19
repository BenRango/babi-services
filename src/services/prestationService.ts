import { Prestation, StatutPrestation } from "@/types/prestation";
import { delay, prestations } from "./_mockData";

const ORDRE_CYCLE: StatutPrestation[] = ["confirmee", "en_route", "en_cours", "terminee"];

export async function getPrestation(id: string): Promise<Prestation> {
  const prestation = prestations.find((p) => p.id === id);
  if (!prestation) throw new Error("Prestation introuvable");
  return delay(prestation);
}

export async function getPrestationByDemande(demandeId: string): Promise<Prestation> {
  const prestation = prestations.find((p) => p.demandeId === demandeId);
  if (!prestation) throw new Error("Prestation introuvable pour cette demande");
  return delay(prestation);
}

/**
 * Fait avancer le cycle confirmee → en_route → en_cours → terminee.
 * Sert à l'écran de suivi (interaction "cliquer les étapes pour simuler").
 */
export async function avancerStatut(id: string): Promise<Prestation> {
  const prestation = prestations.find((p) => p.id === id);
  if (!prestation) throw new Error("Prestation introuvable");
  const indexActuel = ORDRE_CYCLE.indexOf(prestation.statut);
  const suivant = ORDRE_CYCLE[Math.min(indexActuel + 1, ORDRE_CYCLE.length - 1)];
  prestation.statut = suivant;
  prestation.historique.push({ statut: suivant, horodatage: new Date().toISOString() });
  return delay(prestation, 700);
}

export async function confirmerCode(
  prestationId: string,
  code: string
): Promise<{ success: boolean }> {
  const prestation = prestations.find((p) => p.id === prestationId);
  if (!prestation) throw new Error("Prestation introuvable");
  const success = prestation.codeConfirmation === code;
  if (success) prestation.paiementLibere = true;
  return delay({ success }, 500);
}
