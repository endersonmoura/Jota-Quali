import { defineConfig, MsSqlDriver } from "@mikro-orm/mssql";
import env from "./configs/env";
import { Usuario } from "./configs/usuario.entity";
import { Equipamento } from "./configs/equipamento.entity";
import { Calibracao } from "./configs/calibracao.entity";
import { SolicitacaoCalibracao } from "./configs/solicitacao-calibracao.entity";
import { Documento } from "./configs/documento.entity";
import { AuditLog } from "./configs/audit.entity";
import { RecursoCalibracao } from "./configs/recurso-calibracao.entity";
import { Notificacao } from "./configs/notificacao.entity";
import { AssinaturaDigital } from "./configs/assinatura-digital.entity";
import { Perfil } from "./configs/perfil.entity";
import { PadraoReferencia } from "./configs/padrao-referencia.entity";

export default defineConfig({
  driver: MsSqlDriver,
  host: env.dbServer,
  port: env.dbPort ? Number(env.dbPort) : 1433,
  user: env.dbUser,
  password: env.dbPassword,
  dbName: env.dbName,
  entities: [
    Usuario,
    Equipamento,
    Calibracao,
    SolicitacaoCalibracao,
    Documento,
    AuditLog,
    RecursoCalibracao,
    Notificacao,
    AssinaturaDigital,
    Perfil,
    PadraoReferencia,
  ],
  debug: env.nodeEnv === "development",
  dynamicImportProvider: (id) => import(id),
  driverOptions: {
    options: {
      encrypt: process.env.DB_ENCRYPT === "true",
      trustServerCertificate:
        process.env.DB_TRUST_SERVER_CERTIFICATE !== "false",
    },
  },
});
