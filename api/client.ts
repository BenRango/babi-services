import { User } from "@/types/user";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const TOKEN_KEY = "babi_access_token";
const USER_KEY = "babi_user";

export async function saveToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function saveUser(user: User): Promise<void> {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function getStoredUser(): Promise<User | null> {
  const raw = await SecureStore.getItemAsync(USER_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

export async function clearUser(): Promise<void> {
  await SecureStore.deleteItemAsync(USER_KEY);
}

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  // Sans ça, une requête (surtout un upload multipart sur réseau mobile) peut
  // rester bloquée indéfiniment sans jamais résoudre ni rejeter la promesse.
  timeout: 30000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
