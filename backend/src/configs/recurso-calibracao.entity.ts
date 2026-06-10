import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
} from "@mikro-orm/decorators/legacy";
import { Calibracao } from "./calibracao.entity";

@Entity({ tableName: "recurso_calibracao", schema: "dbo" })
export class RecursoCalibracao {
  @PrimaryKey({ type: "uuid", defaultRaw: "NEWID()" })
  id!: string;

  @ManyToOne(() => Calibracao, { fieldName: "calibracao_id" })
  calibracao!: Calibracao;

  @Property({ fieldName: "nome_recurso", type: "varchar", length: 255 })
  nomeRecurso!: string;

  @Property({ fieldName: "created_at", type: "datetime" })
  createdAt: Date = new Date();
}
