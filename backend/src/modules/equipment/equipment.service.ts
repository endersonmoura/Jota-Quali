import { EquipmentRepository } from "./equipment.repository";
import { Equipamento } from "../../configs/equipamento.entity";
import AppError from "../../errors/AppError";
import { EquipmentDTO } from "./equipment.dto";

export class EquipmentService {
  private repository = new EquipmentRepository();

  async createEquipment(data: EquipmentDTO): Promise<Equipamento> {
    if (!data.descricao || !data.codigo || !data.tipo) {
      throw new AppError(
        "Descrição, Código e Tipo são obrigatórios.",
        400,
      );
    }

    const equipamento = this.repository.create({
      descricao: data.descricao.trim(),
      codigo: data.codigo.trim(),
      tipo: data.tipo,
      status: data.status || "disponivel",
      situacaoDocumental: data.situacaoDocumental || "regular",
      obra: data.obraId,
      dataCadastro: data.dataCadastro
        ? new Date(data.dataCadastro)
        : new Date(),
      dataUltimaCalibracao: data.dataUltimaCalibracao ? new Date(data.dataUltimaCalibracao) : undefined,
      dataVencimentoCalibracao: data.dataVencimentoCalibracao ? new Date(data.dataVencimentoCalibracao) : undefined,
      criadoPor: data.criadoPorId,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    });

    // Commit da transação (Unit of Work)
    await this.repository.flush();
    return equipamento;
  }

  async getAllEquipments(): Promise<Equipamento[]> {
    return await this.repository.findAll();
  }

  async getEquipmentById(id: number): Promise<Equipamento> {
    const equipment = await this.repository.findById(id);
    if (!equipment) {
      throw new AppError("Equipamento não encontrado.", 404);
    }
    return equipment;
  }

  async updateEquipment(
    id: number,
    data: Partial<EquipmentDTO>,
  ): Promise<Equipamento> {
    if (!id)
      throw new AppError(
        "ID do equipamento é obrigatório para atualização.",
        400,
      );

    const equipment = await this.getEquipmentById(id);
    
    const updateData: any = { ...data };
    if (updateData.obraId !== undefined) {
      updateData.obra = updateData.obraId;
      delete updateData.obraId;
    }

    await this.repository.update(equipment, updateData);

    await this.repository.flush();
    return equipment;
  }

  async deleteEquipment(id: number): Promise<void> {
    if (!id)
      throw new AppError("ID do equipamento é obrigatório para exclusão.", 400);

    const equipment = await this.getEquipmentById(id);

    // Soft delete: Altera o estado do modelo persistido e descarrega para o banco
    await this.repository.update(equipment, { status: "inativo" });
    await this.repository.flush();
  }
}
