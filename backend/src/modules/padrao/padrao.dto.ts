export interface PadraoResponseDTO {
  id: number;
  codigo: string;
  descricao: string;
  tipo: string;
  status: string;
  situacaoDocumental: string;
  validade?: string;
}

export interface CreatePadraoDTO {
  codigo: string;
  descricao: string;
  tipo?: string;
  status?: string;
  situacaoDocumental?: string;
  validade?: string;
}

export type UpdatePadraoDTO = Partial<CreatePadraoDTO>;
