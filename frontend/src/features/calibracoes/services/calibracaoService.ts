import { api } from "@/services/api";

interface RegistrarInternaInput {
  equipamentoId: number;
  equipamentoReferenciaId: number;
  dataCalibracao: string;
  validade: string;
  cpfResponsavel: string;
  tipoLocal: "laboratorio" | "campo";
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const calibracaoService = {
  async registrarInterna(input: RegistrarInternaInput): Promise<{ calibracaoId: number }> {
    const { data } = await api.post<ApiResponse<{ calibracaoId: number }>>("/calibracoes/interna", input);
    return data.data;
  },

  async getUltima(equipamentoId: number | string): Promise<{
    id: number;
    padraoReferencia: { id: number; codigo: string; descricao: string } | null;
  } | null> {
    const { data } = await api.get<ApiResponse<any>>(`/calibracoes/equipamento/${equipamentoId}/ultima`);
    return data.data;
  }
};
