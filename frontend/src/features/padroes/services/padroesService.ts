import { api } from "@/services/api";
import type { Padrao, PadraoInput } from "../types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const padroesService = {
  async list(): Promise<Padrao[]> {
    const { data } = await api.get<ApiResponse<Padrao[]>>("/padroes-referencia");
    return data.data;
  },

  async getById(id: string | number): Promise<Padrao> {
    const { data } = await api.get<ApiResponse<Padrao>>(`/padroes-referencia/${id}`);
    return data.data;
  },

  async create(input: PadraoInput): Promise<Padrao> {
    const { data } = await api.post<ApiResponse<Padrao>>("/padroes-referencia", input);
    return data.data;
  },

  async update(id: string | number, input: PadraoInput): Promise<Padrao> {
    const { data } = await api.put<ApiResponse<Padrao>>(`/padroes-referencia/${id}`, input);
    return data.data;
  },

  async inativar(id: string | number): Promise<void> {
    await api.delete(`/padroes-referencia/${id}`);
  },
};
