import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authService } from "@/services/auth/auth.service";
import type {
  AuthSession,
  AuthUser,
  LoginCredentials,
  RegisterPayload,
} from "@/services/auth/auth.types";
import type { AuthStatus } from "../types";

export interface AuthContextValue {
  user: AuthUser | null;
  session: AuthSession | null;
  status: AuthStatus;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ token: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateUser: (data: Partial<AuthUser>) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const existing = authService.loadSession();
    if (existing) {
      setSession(existing);
      setStatus("authenticated");
    } else {
      setStatus("unauthenticated");
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setStatus("loading");
    try {
      const next = await authService.login(credentials);
      setSession(next);
      setStatus("authenticated");
    } catch (err) {
      setStatus("unauthenticated");
      throw err;
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setStatus("loading");
    try {
      await authService.register(payload);
      setStatus("unauthenticated");
    } catch (err) {
      setStatus("unauthenticated");
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setSession(null);
    setStatus("unauthenticated");
  }, []);

  const requestPasswordReset = useCallback(
    (email: string) => authService.requestPasswordReset(email),
    []
  );

  const resetPassword = useCallback(
    (token: string, newPassword: string) =>
      authService.resetPassword(token, newPassword),
    []
  );

  const updateUser = useCallback((data: Partial<AuthUser>) => {
    setSession((prev) => {
      if (!prev) return null;
      const updatedSession = {
        ...prev,
        user: { ...prev.user, ...data },
      };
      
      import("@/lib/storage").then(({ storage }) => {
        storage.set("jq.session.v5", updatedSession);
      });
      
      return updatedSession;
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      status,
      login,
      register,
      logout,
      requestPasswordReset,
      resetPassword,
      updateUser,
    }),
    [session, status, login, register, logout, requestPasswordReset, resetPassword, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
