import { api } from "@/services/api";
import type { LogRastreabilidade, AcaoRastreabilidade, EntidadeRastreabilidade } from "../types";

export const rastreabilidadeService = {
  async list(): Promise<LogRastreabilidade[]> {
    const response = await api.get("/auditoria");
    return response.data;
  },

  async log(acao: AcaoRastreabilidade, entidade: EntidadeRastreabilidade, entidadeId: string, detalhes: string): Promise<void> {
    await api.post("/auditoria", {
      acao,
      entidade,
      entidadeId,
      detalhes,
    });
  }
};

