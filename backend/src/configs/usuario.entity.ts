import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";

@Entity({ tableName: "usuario", schema: "dbo" })
export class Usuario {
  @PrimaryKey({ type: "uuid", defaultRaw: "NEWID()" })
  id!: string;

  @Property({ type: "varchar", length: 255 })
  nome!: string;

  @Property({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Property({ type: "varchar", length: 255 })
  senha!: string;

  @Property({ type: "varchar", length: 50 })
  perfil!: "ADMINISTRADOR" | "CALIBRADOR" | "OPERACIONAL" | "CONSULTA";

  @Property({ type: "varchar", length: 50, default: "PENDING" })
  status!: "PENDING" | "APPROVED" | "REJECTED";

  @Property({ fieldName: "created_at", type: "datetime" })
  createdAt: Date = new Date();
}
