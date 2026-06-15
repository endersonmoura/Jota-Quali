import { api } from "@/services/api";
import type { Equipamento, EquipamentoInput } from "../types";
import { rastreabilidadeService } from "@/features/rastreabilidade/services/rastreabilidadeService";

export const equipamentosService = {
  async list(): Promise<Equipamento[]> {
    const response = await api.get("/equipamentos");
    return response.data;
  },

  async create(input: EquipamentoInput): Promise<Equipamento> {
    const response = await api.post("/equipamentos", input);
    const novo = response.data;
    try {
      await rastreabilidadeService.log("Criar", "Equipamento", novo.tag || input.tag, `Equipamento ${novo.nome || input.nome} cadastrado.`);
    } catch (e) {
      console.warn("Failed to log rastreabilidade", e);
    }
    return novo;
  },

  async update(id: string, input: EquipamentoInput): Promise<Equipamento> {
    const response = await api.put(`/equipamentos/${id}`, input);
    const atualizado = response.data;
    try {
      await rastreabilidadeService.log("Editar", "Equipamento", atualizado.tag || input.tag, `Equipamento ${atualizado.nome || input.nome} editado.`);
    } catch (e) {
      console.warn("Failed to log rastreabilidade", e);
    }
    return atualizado;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/equipamentos/${id}`);
    try {
      await rastreabilidadeService.log("Inativar", "Equipamento", String(id), `Equipamento ${id} inativado logicamente.`);
    } catch (e) {
      console.warn("Failed to log rastreabilidade", e);
    }
  },
};

