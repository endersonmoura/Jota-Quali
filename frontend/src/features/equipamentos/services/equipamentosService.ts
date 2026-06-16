import { api } from "@/services/api";
import { auditService } from "@/services/audit/audit.service";
import type { Equipamento, EquipamentoInput } from "../types";

export const equipamentosService = {
  async list(): Promise<Equipamento[]> {
    const response = await api.get("/equipamentos");
    return response.data.data.map((eq: any) => ({
      ...eq,
      obraId: eq.obra?.id || eq.obra || undefined
    }));
  },

  async create(input: EquipamentoInput): Promise<Equipamento> {
    const response = await api.post("/equipamentos", input);
    const eq = response.data.data;
    return { ...eq, obraId: eq.obra?.id || eq.obra || undefined };
  },

  async update(id: string | number, input: EquipamentoInput): Promise<Equipamento> {
    const response = await api.put(`/equipamentos/${id}`, input);
    const eq = response.data.data;
    return { ...eq, obraId: eq.obra?.id || eq.obra || undefined };
  },

  async inativar(id: string | number): Promise<void> {
    await api.patch(`/equipamentos/${id}/inativar`);
  }
};
