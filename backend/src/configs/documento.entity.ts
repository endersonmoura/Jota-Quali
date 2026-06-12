import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
} from "@mikro-orm/decorators/legacy";
import { Calibracao } from "./calibracao.entity";

@Entity({ tableName: "documento", schema: "dbo" })
export class Documento {
  @PrimaryKey({ type: "uuid", defaultRaw: "NEWID()" })
  id!: string;

  @ManyToOne(() => Calibracao, { fieldName: "calibracao_id" })
  calibracao!: Calibracao;

  @Property({ fieldName: "caminho_arquivo", type: "varchar", length: 500 })
  caminhoArquivo!: string;

  @Property({ type: "boolean", default: false })
  assinado!: boolean;

  @Property({ fieldName: "created_at", type: "datetime" })
  createdAt: Date = new Date();
}
