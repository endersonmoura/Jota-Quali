import type { EntityManager } from "@mikro-orm/mssql" with {
  "resolution-mode": "import",
};
import { DI } from "../../configs/db";
import { PadraoReferencia } from "../../configs/padrao-referencia.entity";

export class PadraoRepository {
  private get em(): EntityManager {
    return DI.em;
  }

  public async findAll(): Promise<PadraoReferencia[]> {
    return this.em.find(PadraoReferencia, { status: { $ne: "inativo" } }, { orderBy: { id: "DESC" } });
  }

  public async findById(id: number): Promise<PadraoReferencia | null> {
    return this.em.findOne(PadraoReferencia, { id });
  }

  public async findByCodigo(codigo: string): Promise<PadraoReferencia | null> {
    return this.em.findOne(PadraoReferencia, { codigo });
  }

  public create(padrao: PadraoReferencia): void {
    this.em.persist(padrao);
  }

  public update(padrao: PadraoReferencia, data: Partial<PadraoReferencia>): void {
    this.em.assign(padrao, data);
  }

  public async flush(): Promise<void> {
    await this.em.flush();
  }
}
