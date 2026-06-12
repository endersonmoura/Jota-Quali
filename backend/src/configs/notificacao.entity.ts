import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/decorators/legacy";
import { Equipamento } from "./equipamento.entity";

@Entity({ tableName: "notificacao", schema: "dbo" })
export class Notificacao {
  @PrimaryKey({ type: "int" })
  id!: number;

  @ManyToOne(() => Equipamento, { fieldName: "equipamento_id" })
  equipamento!: Equipamento;

  @Property({ type: "varchar", length: 150 })
  destinatario!: string;

  @Property({ fieldName: "tipo_alerta", type: "varchar", length: 50 })
  tipoAlerta!: string;

  @Property({ fieldName: "data_hora", type: "datetime2" })
  dataHora: Date = new Date();
}
