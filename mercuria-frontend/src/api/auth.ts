import { authClient } from "./client";
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "@/types";

export const authApi = {
  login: (data: LoginRequest) =>
    authClient.post<AuthResponse>("/api/v1/login", data).then((r) => r.data),

  register: (data: RegisterRequest) =>
    authClient.post<AuthResponse>("/api/v1/register", data).then((r) => r.data),

  refresh: (refreshToken: string) =>
    authClient
      .post<AuthResponse>("/api/v1/refresh", { refresh_token: refreshToken })
      .then((r) => r.data),

  me: () => authClient.get<User>("/api/v1/me").then((r) => r.data),
};
