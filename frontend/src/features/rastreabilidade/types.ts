export type AcaoRastreabilidade = "Criar" | "Editar" | "Inativar" | "Calibrar" | "Aprovar";

export type EntidadeRastreabilidade = "Equipamento" | "Laudo" | "Usuário" | "Sistema";

export interface LogRastreabilidade {
  id: string;
  timestamp: string; // ISO Date
  usuarioId: string;
  usuarioNome: string;
  acao: AcaoRastreabilidade;
  entidade: EntidadeRastreabilidade;
  entidadeId: string;
  detalhes: string;
}
