import { User } from "@/types/user";
import { apiClient, saveUser } from "./client";

export interface UpdateProfilePayload {
  nom?: string;
  telephone?: string;
  motDePasseActuel?: string;
  /** Client uniquement — 400 si envoyé par un prestataire. */
  commune?: string;
  /** Prestataire uniquement — 400 si envoyé par un client. */
  communes?: string[];
  /** Prestataire uniquement — 400 si envoyé par un client. */
  categories?: string[];
}

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<User>("/users/me");
  await saveUser(data);
  return data;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const { data } = await apiClient.patch<User>("/users/me", payload);
  await saveUser(data);
  return data;
}
