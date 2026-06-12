export interface CreateReferenceStandardDTO {
  codigo: string;
  descricao: string;
  tipo?: string;
  validade?: string | Date;
}

export interface UpdateReferenceStandardDTO {
  descricao?: string;
  tipo?: string;
  validade?: string | Date;
  status?: string;
  situacaoDocumental?: string;
}
