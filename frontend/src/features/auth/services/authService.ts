import { storage } from "@/lib/storage";
import type {
  AuthSession,
  AuthUser,
  LoginCredentials,
  RegisterPayload,
} from "../types";

const SESSION_KEY = "jq.session.v5";
const RESET_TOKENS_KEY = "jq.resetTokens";

interface MockAccount {
  user: AuthUser;
  password: string;
}

const ACCOUNTS: MockAccount[] = [
  {
    user: {
      id: "u-001",
      name: "Joana Andrade",
      email: "admin@jotaquali.com",
      role: "admin",
      avatarInitials: "JA",
      gender: "feminino",
    },
    password: "admin123",
  },
  {
    user: {
      id: "u-002",
      name: "Rafael Tomaz",
      email: "tecnico@jotaquali.com",
      role: "calibrador",
      avatarInitials: "RT",
      gender: "masculino",
    },
    password: "tecnico123",
  },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const SESSION_DURATION_MS = 1000 * 60 * 60 * 8; // 8h

function buildToken(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    await sleep(650);
    const email = credentials.email.trim().toLowerCase();
    const account = ACCOUNTS.find((a) => a.user.email === email);
    if (!account || account.password !== credentials.password) {
      throw new Error("E-mail ou senha incorretos.");
    }
    const session: AuthSession = {
      user: account.user,
      token: buildToken(),
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };
    storage.set(SESSION_KEY, session);
    return session;
  },

  async register(payload: RegisterPayload): Promise<AuthSession> {
    await sleep(800);
    const email = payload.email.trim().toLowerCase();
    const name = payload.name.trim();
    if (ACCOUNTS.some((a) => a.user.email === email)) {
      throw new Error("Já existe uma conta cadastrada com este e-mail.");
    }
    const initials = name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]!.toUpperCase())
      .join("") || "JQ";
    const newUser: AuthUser = {
      id: `u-${Date.now().toString(36)}`,
      name,
      email,
      role: "aguardando_aprovacao",
      avatarInitials: initials,
      gender: payload.gender,
    };
    ACCOUNTS.push({ user: newUser, password: payload.password });
    const session: AuthSession = {
      user: newUser,
      token: buildToken(),
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };
    storage.set(SESSION_KEY, session);
    return session;
  },

  async logout(): Promise<void> {
    await sleep(120);
    storage.remove(SESSION_KEY);
  },

  loadSession(): AuthSession | null {
    const session = storage.get<AuthSession>(SESSION_KEY);
    if (!session) return null;
    if (session.expiresAt < Date.now()) {
      storage.remove(SESSION_KEY);
      return null;
    }
    return session;
  },

  async requestPasswordReset(email: string): Promise<{ token: string }> {
    await sleep(550);
    const tokens =
      storage.get<Record<string, string>>(RESET_TOKENS_KEY) ?? {};
    const token = buildToken();
    tokens[token] = email.trim().toLowerCase();
    storage.set(RESET_TOKENS_KEY, tokens);
    // Em produção: enviar email. No mock, devolvemos o token.
    return { token };
  },

  async resetPassword(token: string, _newPassword: string): Promise<void> {
    await sleep(550);
    const tokens =
      storage.get<Record<string, string>>(RESET_TOKENS_KEY) ?? {};
    if (!tokens[token]) {
      throw new Error("Link inválido ou expirado.");
    }
    delete tokens[token];
    storage.set(RESET_TOKENS_KEY, tokens);
    // Mock: não persistimos a nova senha.
  },

  listUsers(): AuthUser[] {
    return ACCOUNTS.map((a) => a.user);
  },

  async updateUserRole(userId: string, newRole: AuthUser["role"]): Promise<void> {
    await sleep(400);
    const acc = ACCOUNTS.find((a) => a.user.id === userId);
    if (!acc) throw new Error("Usuário não encontrado.");
    acc.user.role = newRole;
  },

  listMockAccounts(): { email: string; password: string; name: string }[] {
    return ACCOUNTS.map((a) => ({
      email: a.user.email,
      password: a.password,
      name: a.user.name,
    }));
  },
};
