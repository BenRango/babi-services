import { CreerOffrePayload, MesOffre } from "@/types/offre";
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

export interface OffreCreee {
  id: string;
  demandeId: string;
  prestataireId: string;
  prixProposeFcfa: number;
  delaiMinutes: number;
  message?: string | null;
  messageAudioUrl?: string | null;
  statut: string;
  createdAt: string;
}

export async function creerOffre(payload: CreerOffrePayload): Promise<OffreCreee> {
  const formData = new FormData();
  formData.append("demandeId", payload.demandeId);
  formData.append("prixProposeFcfa", String(payload.prixProposeFcfa));
  formData.append("delaiMinutes", String(payload.delaiMinutes));
  if (payload.message) formData.append("message", payload.message);
  if (payload.audio) {
    formData.append("audio", {
      uri: payload.audio.uri,
      name: payload.audio.fileName ?? `message-${Date.now()}.m4a`,
      type: payload.audio.mimeType ?? "audio/m4a",
    } as unknown as Blob);
  }
  const { data } = await apiClient.post<OffreCreee>("/offres", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getMesOffres(): Promise<MesOffre[]> {
  const { data } = await apiClient.get<MesOffre[]>("/offres/mes-offres");
  return data;
}
