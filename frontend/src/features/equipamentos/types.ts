export type StatusEquipamento = "ativo" | "vencido" | "inativo" | "vencendo" | "calibracao";

export interface Equipamento {
  id: number;
  codigo: string;
  descricao: string;
  tipo: string;
  dataUltimaCalibracao?: string | null; // ISO date (YYYY-MM-DD)
  dataVencimentoCalibracao?: string | null;
  obraId?: number;
  status: StatusEquipamento;
  situacaoDocumental?: string;
  criadoEm: string;
}

export type EquipamentoInput = Omit<Equipamento, "id" | "criadoEm">;

export const STATUS_LABEL: Record<StatusEquipamento, string> = {
  ativo: "Ativo",
  vencido: "Vencido",
  inativo: "Inativo",
  vencendo: "Próx. Vencimento",
  calibracao: "Em calibração",
};
