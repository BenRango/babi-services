import { apiClient } from "./client";

/**
 * Réponse de PATCH /offres/:id/accepter — la Prestation créée. On ne type
 * que ce dont l'app a besoin dans l'immédiat (le code à afficher au client) ;
 * le reste du flux (paiement, suivi) est une étape à venir.
 */
export interface PrestationAcceptee {
  id: string;
  codeConfirmation: string;
}

export async function accepterOffre(offreId: string): Promise<PrestationAcceptee> {
  const { data } = await apiClient.patch<PrestationAcceptee>(`/offres/${offreId}/accepter`);
  return data;
}

export async function refuserOffre(offreId: string): Promise<void> {
  await apiClient.patch(`/offres/${offreId}/refuser`);
}
