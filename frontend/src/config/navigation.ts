import {
  LayoutDashboard,
  Wrench,
  Gauge,
  FileText,
  PenTool,
  GitBranch,
  Users,
  Settings,
  Target,
  History,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "./routes";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  description?: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Visão geral",
    items: [
      {
        label: "Dashboard",
        to: ROUTES.dashboard,
        icon: LayoutDashboard,
        description: "Indicadores e visão consolidada",
      },
    ],
  },
  {
    label: "Operação",
    items: [
      {
        label: "Obras",
        to: ROUTES.obras,
        icon: MapPin,
        description: "Gestão de canteiros de obras",
      },
      {
        label: "Equipamentos",
        to: ROUTES.equipamentos,
        icon: Wrench,
        description: "Cadastro e controle de equipamentos",
      },
      {
        label: "Padrões",
        to: ROUTES.padroes,
        icon: Target,
        description: "Gestão de padrões dos equipamentos",
      },
      {
        label: "Calibração",
        to: ROUTES.calibracao,
        icon: Gauge,
        description: "Planos e registros de calibração",
      },
    ],
  },
  {
    label: "Qualidade",
    items: [
      {
        label: "Laudos",
        to: ROUTES.laudos,
        icon: FileText,
        description: "Emissão e consulta de laudos laboratoriais",
      },
      {
        label: "Assinatura Digital",
        to: ROUTES.assinaturaDigital,
        icon: PenTool,
        description: "Assinatura eletrônica de documentos",
      },
    ],
  },
  {
    label: "Administração",
    items: [
      {
        label: "Usuários",
        to: ROUTES.usuarios,
        icon: Users,
        description: "Gestão de usuários e permissões",
      },
      {
        label: "Rastreabilidade",
        to: ROUTES.rastreabilidade,
        icon: History,
        description: "Histórico e auditoria de ações do sistema",
      },
      {
        label: "Configurações",
        to: ROUTES.configuracoes,
        icon: Settings,
        description: "Parâmetros do sistema",
      },
    ],
  },
];
