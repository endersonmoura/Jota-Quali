import type { EntityManager, RequiredEntityData } from "@mikro-orm/mssql" with {
  "resolution-mode": "import",
};
import { DI } from "../../configs/db";
import { Equipamento } from "../../configs/equipamento.entity";

export class EquipmentRepository {
  private get em(): EntityManager {
    return DI.em.fork();
  }

  public async create(
    data: RequiredEntityData<Equipamento>,
  ): Promise<Equipamento> {
    const equipamento = this.em.create(Equipamento, data);
    this.em.persist(equipamento);
    return equipamento;
  }

  public async findAll(): Promise<Equipamento[]> {
    return this.em.find(Equipamento, { status: { $ne: "Inativo" } });
  }

  public async findById(id: string): Promise<Equipamento | null> {
    return this.em.findOne(Equipamento, { id });
  }

  public async update(
    equipamento: Equipamento,
    data: Partial<Equipamento>,
  ): Promise<void> {
    this.em.assign(equipamento, data);
  }

  /**
   * Confirma transacionalmente todas as persistências agendadas no Unit of Work.
   */
  public async flush(): Promise<void> {
    await this.em.flush();
  }
}
