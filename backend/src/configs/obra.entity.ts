import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";

@Entity({ tableName: "obra", schema: "dbo" })
export class Obra {
  @PrimaryKey({ type: "int" })
  id!: number;

  @Property({ fieldName: "nome_obra", type: "varchar", length: 200 })
  nomeObra!: string;

  @Property({ type: "varchar", length: 300, nullable: true })
  localizacao?: string;

  @Property({ type: "varchar", length: 20, default: "ativa" })
  status!: string;

  @Property({ fieldName: "data_cadastro", type: "date" })
  dataCadastro: Date = new Date();

  @Property({ fieldName: "criado_por", type: "int", nullable: true })
  criadoPorId?: number;

  @Property({ fieldName: "criado_em", type: "datetime2" })
  criadoEm: Date = new Date();
}
