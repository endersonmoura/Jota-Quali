export type AcaoRastreabilidade = "Criar" | "Editar" | "Inativar" | "Calibrar" | "Aprovar";
export type EntidadeRastreabilidade = "Equipamento" | "Laudo" | "Usuário" | "Sistema";

export interface AuditResponseDTO {
  id: number;
  userId: number;
  userName: string;
  action: AcaoRastreabilidade | string;
  resource: EntidadeRastreabilidade | string;
  resourceId?: number;
  details?: string;
  createdAt: string;
}
