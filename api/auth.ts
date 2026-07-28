import { User, UserRole } from "@/types/user";
import { apiClient, clearToken, clearUser, saveToken, saveUser } from "./client";

export interface RegisterPayload {
  nom: string;
  telephone: string;
  motDePass: string;
  role: UserRole;
  /** Client uniquement, optionnel. */
  commune?: string;
  /** Prestataire uniquement, optionnel, max 3. */
  communes?: string[];
  /** Prestataire uniquement, obligatoire (1 à 3) si role = prestataire. */
  categories?: string[];
}

export interface LoginPayload {
  telephone: string;
  motDePass: string;
}

interface AuthResponse {
  access_token: string;
  user: User;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", payload);
  await saveToken(data.access_token);
  await saveUser(data.user);
  return data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
  await saveToken(data.access_token);
  await saveUser(data.user);
  return data;
}

export async function logout(): Promise<void> {
  await clearToken();
  await clearUser();
}
