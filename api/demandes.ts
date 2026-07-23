import { Demande } from "@/types/demande";
import { apiClient } from "./client";

export async function getMesDemandes(): Promise<Demande[]> {
  const { data } = await apiClient.get<Demande[]>("/demandes/mes-demandes");
  return data;
}

export async function getDemandeById(id: string): Promise<Demande> {
  const { data } = await apiClient.get<Demande>(`/demandes/${id}`);
  return data;
}
