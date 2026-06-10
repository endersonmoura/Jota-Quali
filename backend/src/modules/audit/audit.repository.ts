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

  public create(data: CreateAuditDTO): void {
    const auditLog = this.em.create(AuditLog, {
      userId: data.userId,
      action: data.action,
      resource: data.resource,
      resourceId: data.resourceId,
      details: data.details,
      createdAt: new Date(),
    });
    this.em.persist(auditLog);
  }

  public async findLogsByResource(resourceId?: string): Promise<AuditLog[]> {
    const query = resourceId ? { resourceId } : {};
    return this.em.find(AuditLog, query, { orderBy: { createdAt: "DESC" } });
  }

  public async flush(): Promise<void> {
    await this.em.flush();
  }
}
