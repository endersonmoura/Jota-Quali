export type StatusEquipamento = "ativo" | "manutencao" | "inativo" | "vencendo";

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
  createdAt: string;
}

export type EquipamentoInput = Omit<Equipamento, "id" | "createdAt">;

export const STATUS_LABEL: Record<StatusEquipamento, string> = {
  ativo: "Ativo",
  manutencao: "Em manutenção",
  inativo: "Inativo",
  vencendo: "Próx. Vencimento",
};
