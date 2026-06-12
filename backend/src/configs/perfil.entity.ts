import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";

@Entity({ tableName: "perfil", schema: "dbo" })
export class Perfil {
  @PrimaryKey({ type: "int" })
  id!: number;

  @Property({ fieldName: "nome_perfil", type: "varchar", length: 50, unique: true })
  nomePerfil!: string;

  @Property({ type: "nvarchar", columnType: "nvarchar(max)", default: "{}" })
  permissoes!: string;

  @Property({ fieldName: "criado_em", type: "datetime2" })
  criadoEm: Date = new Date();
}
