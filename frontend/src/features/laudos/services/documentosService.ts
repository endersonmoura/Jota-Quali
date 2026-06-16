import { api } from "@/services/api";

export interface Documento {
  id: number;
  tipoDocumental: string;
  dataEmissao: string;
  dataVencimento: string;
  laboratorio?: string;
  statusAssinatura: boolean;
  status: string; // "aguardando_assinatura", "assinado"
  pathArquivo?: string;
  criadoEm: string;
  atualizadoEm: string;
  equipamento?: {
    id: number;
    codigo: string;
    descricao: string;
    tipo: string;
    obraId?: number;
  } | null;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const documentosService = {
  async list(): Promise<Documento[]> {
    const { data } = await api.get<ApiResponse<Documento[]>>("/documentos");
    return data.data;
  },

  async getById(id: number | string): Promise<Documento> {
    const { data } = await api.get<ApiResponse<Documento>>(`/documentos/${id}`);
    return data.data;
  },

  async uploadLaudo(formData: FormData): Promise<{ documentoId: number; url: string }> {
    const { data } = await api.post<ApiResponse<{ documentoId: number; url: string }>>(
      "/documentos/upload-laudo",
      formData
    );
    return data.data;
  },

  async assinar(formData: FormData): Promise<{ url: string }> {
    const { data } = await api.post<ApiResponse<{ url: string }>>(
      "/documentos/assinar",
      formData
    );
    return data.data;
  },

  async delete(documentoId: number): Promise<void> {
    await api.delete(`/documentos/${documentoId}`);
  }
};
