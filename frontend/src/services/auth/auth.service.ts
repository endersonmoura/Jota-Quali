import { api } from "../api";
import { storage } from "@/lib/storage";
import type { AuthSession, LoginCredentials, RegisterPayload } from "./auth.types";

const SESSION_KEY = "jq.session.v5";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const response = await api.post("/auth/login", credentials);
    const authData = response.data.data;
    
    const session: AuthSession = {
      user: authData.user,
      token: authData.token,
      expiresAt: Date.now() + (authData.expiresIn * 1000) || Date.now() + 1000 * 60 * 60 * 8,
    };
    
    storage.set(SESSION_KEY, session);
    localStorage.setItem("@JotaQuali:token", authData.token);
    return session;
  },

  async register(payload: RegisterPayload): Promise<void> {
    await api.post("/auth/register", payload);
  },

  async logout(): Promise<void> {
    storage.remove(SESSION_KEY);
    localStorage.removeItem("@JotaQuali:token");
  },

  loadSession(): AuthSession | null {
    const session = storage.get<AuthSession>(SESSION_KEY);
    if (!session) return null;
    if (session.expiresAt < Date.now()) {
      this.logout();
      return null;
    }
    return session;
  },

  async requestPasswordReset(email: string): Promise<{ token: string }> {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post("/auth/reset-password", { token, newPassword });
  }
};
