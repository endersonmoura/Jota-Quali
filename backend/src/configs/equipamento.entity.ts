import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/decorators/legacy";
import { Obra } from "./obra.entity";
import { Usuario } from "./usuario.entity";

@Entity({ tableName: "equipamento", schema: "dbo" })
export class Equipamento {
  @PrimaryKey({ type: "int" })
  id!: number;

  @ManyToOne(() => Obra, { fieldName: "obra_id", nullable: true })
  obra?: Obra;

  @Property({ type: "varchar", length: 50, unique: true })
  codigo!: string;

  @Property({ type: "varchar", length: 200 })
  descricao!: string;

  @Property({ type: "varchar", length: 100, nullable: true })
  tipo?: string;

  @Property({ type: "varchar", length: 40, default: "disponivel" })
  status!: string;

  @Property({ fieldName: "situacao_documental", type: "varchar", length: 30, default: "regular" })
  situacaoDocumental!: string;

  @Property({ fieldName: "data_cadastro", type: "date" })
  dataCadastro: Date = new Date();

  @Property({ fieldName: "data_ultima_calibracao", type: "date", nullable: true })
  dataUltimaCalibracao?: Date;

  @Property({ fieldName: "data_vencimento_calibracao", type: "date", nullable: true })
  dataVencimentoCalibracao?: Date;

  @ManyToOne(() => Usuario, { fieldName: "criado_por", nullable: true })
  criadoPor?: Usuario;

  @Property({ fieldName: "criado_em", type: "datetime2" })
  criadoEm: Date = new Date();

  @Property({ fieldName: "atualizado_em", type: "datetime2", onUpdate: () => new Date() })
  atualizadoEm: Date = new Date();
}
