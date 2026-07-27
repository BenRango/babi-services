import { PrestationDetail } from "@/types/prestation";
import { apiClient } from "./client";

export async function getMesPrestations(): Promise<PrestationDetail[]> {
  const { data } = await apiClient.get<PrestationDetail[]>("/prestations/mes-prestations");
  return data;
}

export async function getPrestationById(id: string): Promise<PrestationDetail> {
  const { data } = await apiClient.get<PrestationDetail>(`/prestations/${id}`);
  return data;
}

export async function demarrerPrestation(id: string): Promise<PrestationDetail> {
  const { data } = await apiClient.patch<PrestationDetail>(`/prestations/${id}/demarrer`);
  return data;
}

export async function commencerPrestation(id: string): Promise<PrestationDetail> {
  const { data } = await apiClient.patch<PrestationDetail>(`/prestations/${id}/commencer`);
  return data;
}

export async function validerCode(id: string, code: string): Promise<PrestationDetail> {
  const { data } = await apiClient.patch<PrestationDetail>(`/prestations/${id}/valider-code`, { code });
  return data;
}
