export type StatusEquipamento = "ativo" | "vencido" | "inativo" | "vencendo" | "calibracao";

export interface Equipamento {
  id: string;
  tag: string;
  nome: string;
  ultimaCalibracao: string | null; // ISO date (YYYY-MM-DD)
  localizacao: string;
  status: StatusEquipamento;
  padrao?: string;
  laudoAssinado?: boolean;
  tipoCalibracao?: "laboratorio" | "campo";
  statusLaudo?: "aguardando_assinatura";
  createdAt: string;
}

export type EquipamentoInput = Omit<Equipamento, "id" | "createdAt">;

export const STATUS_LABEL: Record<StatusEquipamento, string> = {
  ativo: "Ativo",
  vencido: "Vencido",
  inativo: "Inativo",
  vencendo: "Próx. Vencimento",
  calibracao: "Em calibração",
};
