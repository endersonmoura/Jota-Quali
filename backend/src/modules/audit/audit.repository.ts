import type { EntityManager, EntityRepository } from "@mikro-orm/mssql" with {
  "resolution-mode": "import",
};
import { DI } from "../../configs/db";
import { CreateAuditDTO } from "./audit.dto";
import { AuditLog } from "../../configs/audit.entity";

export class AuditRepository {
  private get em(): EntityManager {
    return DI.em.fork();
  }

  public async create(data: CreateAuditDTO): Promise<void> {
    const em = this.em;
    const auditLog = em.create(AuditLog, {
      usuarioId: data.userId,
      acao: data.action,
      entidade: data.resource,
      entidadeId: data.resourceId || 0,
      detalhes: data.details,
      dataHora: new Date(),
    });
    em.persist(auditLog);
    await em.flush();
  }

  public async findLogsByResource(resourceId?: number): Promise<any[]> {
    const em = this.em;
    const qb = em.createQueryBuilder(AuditLog, 'a');
    qb.select(['a.*', 'u.nome as usuarioNome'])
      .leftJoin('a.usuario', 'u')
      .orderBy({ dataHora: "DESC" });
    
    if (resourceId) {
      qb.where({ entidadeId: resourceId });
    }
    
    return qb.execute();
  }


}
