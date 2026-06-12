import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
} from "@mikro-orm/decorators/legacy";
import { Collection } from "@mikro-orm/core";
import { Equipamento } from "./equipamento.entity";
import { Documento } from "./documento.entity";
import { RecursoCalibracao } from "./recurso-calibracao.entity";
import { Usuario } from "./usuario.entity";
import { PadraoReferencia } from "./padrao-referencia.entity";

@Entity({ tableName: "calibracao", schema: "dbo" })
export class Calibracao {
  @PrimaryKey({ type: "int" })
  id!: number;

  @ManyToOne(() => Equipamento, { fieldName: "equipamento_id" })
  equipamento!: Equipamento;

  @ManyToOne(() => PadraoReferencia, {
    fieldName: "padrao_referencia_id",
    nullable: true,
  })
  padraoReferencia?: PadraoReferencia;

  @ManyToOne(() => Usuario, { fieldName: "usuario_id" })
  usuario!: Usuario;

  @Property({ type: "varchar", length: 10 })
  tipo!: string;

  @Property({ fieldName: "data_realizacao", type: "date" })
  dataRealizacao!: Date;

  @Property({ fieldName: "data_validade", type: "date" })
  dataValidade!: Date;

  @Property({ fieldName: "cpf_responsavel", type: "varchar", length: 14, nullable: true })
  cpfResponsavel?: string;

  @Property({ type: "varchar", length: 30, default: "pendente_documento" })
  status!: string;

  @Property({ fieldName: "criado_em", type: "datetime2" })
  criadoEm: Date = new Date();

  @Property({ fieldName: "atualizado_em", type: "datetime2", onUpdate: () => new Date() })
  atualizadoEm: Date = new Date();

  @OneToMany(() => Documento, (doc: Documento) => doc.calibracao)
  documentos = new Collection<Documento>(this);

  @OneToMany(
    () => RecursoCalibracao,
    (rec: RecursoCalibracao) => rec.calibracao,
  )
  recursos = new Collection<RecursoCalibracao>(this);
}
