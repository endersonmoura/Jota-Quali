export interface ObraDTO {
  id: number;
  nomeObra: string;
  localizacao?: string;
  status: string;
}

export interface CreateObraDTO {
  nomeObra: string;
  localizacao?: string;
  criadoPorId?: number;
}

export interface UpdateObraDTO {
  nomeObra?: string;
  localizacao?: string;
  status?: string;
}
