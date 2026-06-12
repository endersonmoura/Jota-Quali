import { EquipmentRepository } from "./equipment.repository";
import { Equipamento } from "../../configs/equipamento.entity";
import AppError from "../../errors/AppError";
import { EquipmentDTO } from "./equipment.dto";

export class EquipmentService {
  private repository = new EquipmentRepository();

  async createEquipment(data: EquipmentDTO): Promise<void> {
    if (!data.descricao || !data.CodigoPatrimonio || !data.tipo) {
      throw new AppError(
        "Descrição, Código de Patrimônio e Tipo são obrigatórios.",
        400,
      );
    }

    await this.repository.create({
      descricao: data.descricao.trim(),
      codigo: data.CodigoPatrimonio.trim(),
      tipo: data.tipo,
      status: data.status || "Disponivel",
      dataAquisicao: data.dataAquisicao
        ? new Date(data.dataAquisicao)
        : undefined,
      createdAt: new Date(),
    });

    // Commit da transação (Unit of Work)
    await this.repository.flush();
  }

  async getAllEquipments(): Promise<Equipamento[]> {
    return await this.repository.findAll();
  }

  async getEquipmentById(id: string): Promise<Equipamento> {
    const equipment = await this.repository.findById(id);
    if (!equipment) {
      throw new AppError("Equipamento não encontrado.", 404);
    }
    return equipment;
  }

  async updateEquipment(
    id: string,
    data: Partial<EquipmentDTO>,
  ): Promise<void> {
    if (!id)
      throw new AppError(
        "ID do equipamento é obrigatório para atualização.",
        400,
      );

    const equipment = await this.getEquipmentById(id);
    await this.repository.update(equipment, data);

    await this.repository.flush();
  }

  async deleteEquipment(id: string): Promise<void> {
    if (!id)
      throw new AppError("ID do equipamento é obrigatório para exclusão.", 400);

    const equipment = await this.getEquipmentById(id);

    // Soft delete: Altera o estado do modelo persistido e descarrega para o banco
    await this.repository.update(equipment, { status: "Inativo" });
    await this.repository.flush();
  }
}
