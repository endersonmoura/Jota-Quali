export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "consulta" | "calibrador" | "operacional" | "aguardando_aprovacao";
  avatarInitials: string;
  cpf?: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: number;
}

export type AuthStatus =
  | "idle"
  | "loading"
  | "authenticated"
  | "unauthenticated";

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  consulta: "Consulta",
  calibrador: "Calibrador",
  operacional: "Operacional",
  aguardando_aprovacao: "Aguardando Aprovação",
};
