import { User, UserRole } from "@/types/user";
import { apiClient, saveToken } from "./client";

export interface RegisterPayload {
  nom: string;
  telephone: string;
  motDePass: string;
  role: UserRole;
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
  return data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
  await saveToken(data.access_token);
  return data;
}
