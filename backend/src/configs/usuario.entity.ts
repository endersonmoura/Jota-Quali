import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/decorators/legacy";
import { Perfil } from "./perfil.entity";

@Entity({ tableName: "usuario", schema: "dbo" })
export class Usuario {
  @PrimaryKey({ type: "int" })
  id!: number;

  @ManyToOne(() => Perfil, { fieldName: "perfil_id" })
  perfil!: Perfil;

  @Property({ type: "varchar", length: 150 })
  nome!: string;

  @Property({ type: "varchar", length: 150, unique: true })
  email!: string;

  @Property({ fieldName: "senha_hash", type: "varchar", length: 255 })
  senhaHash!: string;

  @Property({ type: "varchar", length: 14, unique: true })
  cpf!: string;

  @Property({ type: "varchar", length: 20, default: "ativo" })
  status!: string;

  @Property({ fieldName: "criado_em", type: "datetime2" })
  criadoEm: Date = new Date();

  @Property({ fieldName: "atualizado_em", type: "datetime2", onUpdate: () => new Date() })
  atualizadoEm: Date = new Date();
}
