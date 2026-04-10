import { EquipmentRepository } from "./equipment.repository";
import { IEquipment } from "../../@types";
import AppError from "../../errors/AppError";

export class EquipmentService {
  private repository = new EquipmentRepository();

  async createEquipment(data: IEquipment): Promise<void> {
    if (!data.Nome || !data.CodigoPatrimonio || !data.DataAquisicao) {
      throw new AppError(
        "Nome, Código de Patrimônio e Data de Aquisição são obrigatórios.",
        400,
      );
    }

    await this.repository.create(data);
  }

  async getAllEquipments(): Promise<IEquipment[]> {
    return await this.repository.findAll();
  }

  async getEquipmentById(id: string): Promise<IEquipment> {
    const equipment = await this.repository.findById(id);
    if (!equipment) {
      throw new AppError("Equipamento não encontrado.", 404);
    }
    return equipment;
  }

  async updateEquipment(id: string, data: Partial<IEquipment>): Promise<void> {
    if (!id)
      throw new AppError(
        "ID do equipamento é obrigatório para atualização.",
        400,
      );

    await this.getEquipmentById(id);

    await this.repository.update(id, data);
  }

  async deleteEquipment(id: string): Promise<void> {
    if (!id)
      throw new AppError("ID do equipamento é obrigatório para exclusão.", 400);

    await this.getEquipmentById(id);

    await this.repository.delete(id);
  }
}
