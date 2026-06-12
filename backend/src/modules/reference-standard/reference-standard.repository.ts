import type { EntityManager, RequiredEntityData } from "@mikro-orm/mssql" with {
  "resolution-mode": "import",
};
import { DI } from "../../configs/db";
import { PadraoReferencia } from "../../configs/padrao-referencia.entity";

export class ReferenceStandardRepository {
  private get em(): EntityManager {
    return DI.em.fork();
  }

  public async findAll(): Promise<PadraoReferencia[]> {
    return this.em.find(PadraoReferencia, {});
  }

  public async findById(id: number): Promise<PadraoReferencia | null> {
    return this.em.findOne(PadraoReferencia, { id });
  }

  public async findByCodigo(codigo: string): Promise<PadraoReferencia | null> {
    return this.em.findOne(PadraoReferencia, { codigo });
  }

  public async create(data: RequiredEntityData<PadraoReferencia>): Promise<PadraoReferencia> {
    const em = this.em;
    const padrao = em.create(PadraoReferencia, data);
    em.persist(padrao);
    await em.flush();
    return padrao;
  }

  public async update(padrao: PadraoReferencia, data: Partial<PadraoReferencia>): Promise<PadraoReferencia> {
    const em = this.em;
    em.assign(padrao, data);
    em.persist(padrao);
    await em.flush();
    return padrao;
  }
}
