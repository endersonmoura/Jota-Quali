import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
} from "@mikro-orm/decorators/legacy";
import { Equipamento } from "./equipamento.entity";

@Entity({ tableName: "solicitacao_calibracao", schema: "dbo" })
export class SolicitacaoCalibracao {
  @PrimaryKey({ type: "uuid", defaultRaw: "NEWID()" })
  id!: string;

  @ManyToOne(() => Equipamento, { fieldName: "equipamento_id" })
  equipamento!: Equipamento;

  @Property({ type: "varchar", length: 50 })
  tipo!: "EXTERNA" | "INTERNA";

  @Property({ fieldName: "prazo_retorno_dias", type: "int" })
  prazoRetornoDias!: number;

  @Property({ fieldName: "solicitante_id", type: "uuid" })
  solicitanteId!: string;

  @Property({ type: "varchar", length: 50, default: "PENDENTE" })
  status!: string;

  @Property({ fieldName: "created_at", type: "datetime" })
  createdAt: Date = new Date();
}
