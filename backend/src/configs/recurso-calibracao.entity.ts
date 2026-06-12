import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
} from "@mikro-orm/decorators/legacy";
import { Calibracao } from "./calibracao.entity";
import { Documento } from "./documento.entity";

@Entity({ tableName: "recurso_calibracao", schema: "dbo" })
export class RecursoCalibracao {
  @PrimaryKey({ type: "int" })
  id!: number;

  @ManyToOne(() => Calibracao, { fieldName: "calibracao_id", nullable: true })
  calibracao?: Calibracao;

  @ManyToOne(() => Documento, { fieldName: "documento_id", nullable: true })
  documento?: Documento;

  @Property({ fieldName: "item_descricao", type: "varchar", length: 200 })
  itemDescricao!: string;

  @Property({ type: "varchar", length: 50, nullable: true })
  quantidade?: string;

  @Property({ fieldName: "tipo_recurso", type: "varchar", length: 50, nullable: true })
  tipoRecurso?: string;

  @Property({ fieldName: "criado_em", type: "datetime2" })
  criadoEm: Date = new Date();
}
