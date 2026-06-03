import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";

@Entity({ tableName: "log_auditoria", schema: "dbo" })
export class AuditLog {
  @PrimaryKey({ type: "uuid", defaultRaw: "NEWID()" })
  id!: string;

  @Property({ fieldName: "user_id", type: "uuid" })
  userId!: string;

  @Property({ type: "varchar", length: 255 })
  action!: string;

  @Property({ type: "varchar", length: 255 })
  resource!: string;

  @Property({
    fieldName: "resource_id",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  resourceId?: string;

  @Property({ type: "text", nullable: true })
  details?: string;

  @Property({ fieldName: "created_at", type: "datetime" })
  createdAt: Date = new Date();
}
