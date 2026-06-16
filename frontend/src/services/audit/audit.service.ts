import { api } from "../api";
import type { AuditResponseDTO, AcaoRastreabilidade, EntidadeRastreabilidade } from "./audit.types";

export const auditService = {
  async list(): Promise<AuditResponseDTO[]> {
    const response = await api.get("/auditoria");
    // O backend retorna { success: true, data: [...] }
    return response.data.data;
  },

  async log(action: AcaoRastreabilidade, resource: EntidadeRastreabilidade, resourceId: number, details: string): Promise<void> {
    await api.post("/auditoria", {
      action,
      resource,
      resourceId,
      details,
    });
  }
};
