import { api } from "../api";

export interface ObraDTO {
  id: number;
  nomeObra: string;
  localizacao?: string;
  status: string;
}

export interface CreateObraDTO {
  nomeObra: string;
  localizacao?: string;
}

export interface UpdateObraDTO {
  nomeObra?: string;
  localizacao?: string;
  status?: string;
}

export const obraService = {
  async list(status?: string): Promise<ObraDTO[]> {
    const params = status ? { status } : {};
    const response = await api.get("/obras", { params });
    return response.data.data;
  },

  async create(data: CreateObraDTO): Promise<ObraDTO> {
    const response = await api.post("/obras", data);
    return response.data.data;
  },

  async update(id: number, data: UpdateObraDTO): Promise<ObraDTO> {
    const response = await api.patch(`/obras/${id}`, data);
    return response.data.data;
  }
};
