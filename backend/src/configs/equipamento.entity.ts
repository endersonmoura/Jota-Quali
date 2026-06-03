import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";

@Entity({ tableName: "equipamento", schema: "dbo" })
export class Equipamento {
  @PrimaryKey({ type: "uuid", defaultRaw: "NEWID()" })
  id!: string;

  @Property({ type: "varchar", length: 100 })
  codigo!: string;

  @Property({ type: "varchar", length: 255 })
  descricao!: string;

  @Property({ type: "varchar", length: 100 })
  tipo!: string;

  @Property({ type: "varchar", length: 50, default: "Disponivel" })
  status!: "Disponivel" | "Em Manutencao" | "Calibracao" | "Inativo";

  @Property({ fieldName: "data_aquisicao", type: "datetime", nullable: true })
  dataAquisicao?: Date;

  @Property({ fieldName: "created_at", type: "datetime" })
  createdAt: Date = new Date();
}
