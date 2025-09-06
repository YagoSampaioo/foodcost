import { apiClient } from "../config/axios";
import { AuthUser } from "../types";

interface LoginCredentials {
  email: string;
  password: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    try {
      await apiClient.post("/auth/login", credentials);

      const { data: user } = await apiClient.get<AuthUser>("/auth/me");
      return user;
    } catch (error: any) {
      console.error("Erro completo no login:", error.response?.data || error);
      throw new Error(error.response?.data?.error || "Email ou senha inválidos.");
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }

  async getCurrentUser(): Promise<AuthUser> {
    try {
      const { data: user } = await apiClient.get<AuthUser>("/auth/me");
      return user;
    } catch (error) {
      console.error("Nenhuma sessão ativa encontrada:", error);
      throw new Error("Sessão inválida ou expirada.");
    }
  }
}

export const authService = new AuthService();
