import { Demande, DemandeMode, TypeDescription } from "@/types/demande";
import { apiClient } from "./client";

export async function getMesDemandes(): Promise<Demande[]> {
  const { data } = await apiClient.get<Demande[]>("/demandes/mes-demandes");
  return data;
}

export async function getDemandeById(id: string): Promise<Demande> {
  const { data } = await apiClient.get<Demande>(`/demandes/${id}`);
  return data;
}

export interface CreateDemandePayload {
  categorie: string;
  budgetMaxFcfa: number;
  commune?: string;
  mode: DemandeMode;
  typeDescription: TypeDescription;
  /** requis si typeDescription = TEXT, libre sinon (accepté même si AUDIO) */
  description?: string;
  /** requis si typeDescription = AUDIO, libre sinon (accepté même si TEXT) */
  audio?: { uri: string; mimeType?: string | null; fileName?: string | null };
  /** toujours optionnel, une seule photo */
  photo?: { uri: string; mimeType?: string | null; fileName?: string | null };
}

export async function createDemande(payload: CreateDemandePayload): Promise<Demande> {
  const formData = new FormData();
  formData.append("categorie", payload.categorie);
  formData.append("budgetMaxFcfa", String(payload.budgetMaxFcfa));
  if (payload.commune) formData.append("commune", payload.commune);
  formData.append("mode", payload.mode);
  formData.append("typeDescription", payload.typeDescription);
  // description et audio peuvent coexister (backend permissif) ; seul celui qui
  // correspond à typeDescription est strictement requis, l'autre part si présent.
  if (payload.description) formData.append("description", payload.description);
  if (payload.audio) {
    formData.append("audio", {
      uri: payload.audio.uri,
      name: payload.audio.fileName ?? `note-${Date.now()}.m4a`,
      type: payload.audio.mimeType ?? "audio/m4a",
    } as unknown as Blob);
  }
  if (payload.photo) {
    formData.append("picture", {
      uri: payload.photo.uri,
      name: payload.photo.fileName ?? `photo-${Date.now()}.jpg`,
      type: payload.photo.mimeType ?? "image/jpeg",
    } as unknown as Blob);
  }

  const { data } = await apiClient.post<Demande>("/demandes", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
