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

@Entity({ tableName: "calibracao", schema: "dbo" })
export class Calibracao {
  @PrimaryKey({ type: "uuid", defaultRaw: "NEWID()" })
  id!: string;

  @ManyToOne(() => Equipamento, { fieldName: "equipamento_id" })
  equipamento!: Equipamento;

  @ManyToOne(() => Equipamento, {
    fieldName: "equipamento_referencia_id",
    nullable: true,
  })
  equipamentoReferencia?: Equipamento;

  @Property({ fieldName: "data_calibracao", type: "datetime" })
  dataCalibracao!: Date;

  @Property({ type: "datetime" })
  validade!: Date;

  @Property({ fieldName: "calibrador_id", type: "uuid" })
  calibradorId!: string;

  @Property({ fieldName: "created_at", type: "datetime" })
  createdAt: Date = new Date();

  @OneToMany(() => Documento, (doc: Documento) => doc.calibracao)
  documentos = new Collection<Documento>(this);

  @OneToMany(
    () => RecursoCalibracao,
    (rec: RecursoCalibracao) => rec.calibracao,
  )
  recursos = new Collection<RecursoCalibracao>(this);
}
