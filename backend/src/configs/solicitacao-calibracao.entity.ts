import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
} from "@mikro-orm/decorators/legacy";
import { Equipamento } from "./equipamento.entity";
import { Usuario } from "./usuario.entity";

@Entity({ tableName: "solicitacao_calibracao", schema: "dbo" })
export class SolicitacaoCalibracao {
  @PrimaryKey({ type: "int" })
  id!: number;

  @ManyToOne(() => Equipamento, { fieldName: "equipamento_id" })
  equipamento!: Equipamento;

  @ManyToOne(() => Usuario, { fieldName: "usuario_solicitante_id" })
  usuarioSolicitante!: Usuario;

  @Property({ fieldName: "tipo_calibracao", type: "varchar", length: 10 })
  tipoCalibracao!: string;

  @Property({ fieldName: "data_solicitacao", type: "date" })
  dataSolicitacao: Date = new Date();

  @Property({ fieldName: "prazo_retorno", type: "date" })
  prazoRetorno!: Date;

  @Property({ type: "varchar", length: 30, default: "aberta" })
  status!: string;

  @Property({ type: "nvarchar", columnType: "nvarchar(max)", nullable: true })
  observacao?: string;

  @Property({ fieldName: "criado_em", type: "datetime2" })
  criadoEm: Date = new Date();

  @Property({ fieldName: "atualizado_em", type: "datetime2", onUpdate: () => new Date() })
  atualizadoEm: Date = new Date();
}
