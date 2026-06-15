export const ROUTES = {
  login: "/login",
  register: "/cadastro",
  forgotPassword: "/recuperar-senha",
  resetPassword: "/redefinir-senha",
  dashboard: "/",
  equipamentos: "/equipamentos",
  padroes: "/padroes",
  calibracao: "/calibracao",
  laudos: "/laudos",
  assinaturaDigital: "/assinatura-digital",
  usuarios: "/usuarios",
  configuracoes: "/configuracoes",
  perfil: "/perfil",
  rastreabilidade: "/rastreabilidade",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
