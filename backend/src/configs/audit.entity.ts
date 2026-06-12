import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";

@Entity({ tableName: "log_auditoria", schema: "dbo" })
export class AuditLog {
  @PrimaryKey({ type: "int" })
  id!: number;

  @Property({ fieldName: "usuario_id", type: "int" })
  usuarioId!: number;

  @Property({ type: "varchar", length: 50 })
  acao!: string;

  @Property({ type: "varchar", length: 50 })
  entidade!: string;

  @Property({ fieldName: "entidade_id", type: "int" })
  entidadeId!: number;

  @Property({ fieldName: "data_hora", type: "datetime2" })
  dataHora: Date = new Date();

  @Property({ type: "nvarchar", columnType: "nvarchar(max)", nullable: true })
  detalhes?: string;
}
