import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authService } from "../services/authService";
import type {
  AuthSession,
  AuthStatus,
  AuthUser,
  LoginCredentials,
  RegisterPayload,
} from "../types";

export interface AuthContextValue {
  user: AuthUser | null;
  session: AuthSession | null;
  status: AuthStatus;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ token: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
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
    }),
    [session, status, login, register, logout, requestPasswordReset, resetPassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
