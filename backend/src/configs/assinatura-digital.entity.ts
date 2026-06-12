import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
} from "@mikro-orm/decorators/legacy";
import { Documento } from "./documento.entity";
import { Usuario } from "./usuario.entity";

@Entity({ tableName: "assinatura_digital", schema: "dbo" })
export class AssinaturaDigital {
  @PrimaryKey({ type: "int" })
  id!: number;

  @ManyToOne(() => Documento, { fieldName: "documento_id" })
  documento!: Documento;

  @ManyToOne(() => Usuario, { fieldName: "usuario_id" })
  usuario!: Usuario;

  @Property({ fieldName: "data_hora_assinatura", type: "datetime2" })
  dataHoraAssinatura: Date = new Date();

  @Property({ fieldName: "hash_assinatura", type: "varchar", length: 512, nullable: true })
  hashAssinatura?: string;

  @Property({ fieldName: "ip_origem", type: "varchar", length: 45, nullable: true })
  ipOrigem?: string;

  @Property({ fieldName: "criado_em", type: "datetime2" })
  criadoEm: Date = new Date();
}
