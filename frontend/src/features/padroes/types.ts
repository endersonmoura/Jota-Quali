export interface Padrao {
  id: number;
  codigo: string;
  descricao: string;
  tipo?: string;
  validade?: string | null;
  status: string;
  situacaoDocumental: string;
  criadoEm: string;
  atualizadoEm?: string;
}

export type PadraoInput = Omit<Padrao, "id" | "criadoEm" | "atualizadoEm">;
