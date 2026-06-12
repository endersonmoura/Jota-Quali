import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
} from "@mikro-orm/decorators/legacy";
import { Calibracao } from "./calibracao.entity";
import { Equipamento } from "./equipamento.entity";

@Entity({ tableName: "documento", schema: "dbo" })
export class Documento {
  @PrimaryKey({ type: "int" })
  id!: number;

  @ManyToOne(() => Calibracao, { fieldName: "calibracao_id", nullable: true })
  calibracao?: Calibracao;

  @ManyToOne(() => Equipamento, { fieldName: "equipamento_id", nullable: true })
  equipamento?: Equipamento;

  @Property({ fieldName: "tipo_documental", type: "varchar", length: 30 })
  tipoDocumental!: string;

  @Property({ fieldName: "data_emissao", type: "date" })
  dataEmissao!: Date;

  @Property({ fieldName: "data_vencimento", type: "date" })
  dataVencimento!: Date;

  @Property({ type: "varchar", length: 200, nullable: true })
  laboratorio?: string;

  @Property({ fieldName: "status_assinatura", type: "boolean", default: false })
  statusAssinatura!: boolean;

  @Property({ fieldName: "path_arquivo", type: "varchar", length: 500, nullable: true })
  pathArquivo?: string;

  @Property({ fieldName: "criado_em", type: "datetime2" })
  criadoEm: Date = new Date();

  @Property({ fieldName: "atualizado_em", type: "datetime2", onUpdate: () => new Date() })
  atualizadoEm: Date = new Date();
}
