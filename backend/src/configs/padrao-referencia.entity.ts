import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";

@Entity({ tableName: "padrao_referencia", schema: "dbo" })
export class PadraoReferencia {
  @PrimaryKey({ type: "int" })
  id!: number;

  @Property({ type: "varchar", length: 50, unique: true })
  codigo!: string;

  @Property({ type: "varchar", length: 200 })
  descricao!: string;

  @Property({ type: "varchar", length: 100, nullable: true })
  tipo?: string;

  @Property({ type: "date", nullable: true })
  validade?: Date;

  @Property({ type: "varchar", length: 30, default: "disponivel" })
  status!: string;

  @Property({ fieldName: "situacao_documental", type: "varchar", length: 30, default: "regular" })
  situacaoDocumental!: string;

  @Property({ fieldName: "criado_em", type: "datetime2" })
  criadoEm: Date = new Date();

  @Property({ fieldName: "atualizado_em", type: "datetime2", onUpdate: () => new Date() })
  atualizadoEm: Date = new Date();
}
