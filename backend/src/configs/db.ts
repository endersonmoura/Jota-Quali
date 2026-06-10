import type { MikroORM, EntityManager } from "@mikro-orm/mssql" with {
  "resolution-mode": "import",
};
import logger from "../utils/logger";
import config from "../mikro-orm.config";

// Objeto global para Injeção de Dependência (DI) das instâncias do MikroORM
export const DI = {} as {
  orm: MikroORM;
  em: EntityManager;
};

export const connectToDatabase = async () => {
  try {
    logger.info("Iniciando conexão via MikroORM...");

    // Importação dinâmica para contornar restrições de ESM em módulos CJS
    const { MikroORM } = await import("@mikro-orm/mssql");
    DI.orm = await MikroORM.init(config);
    DI.em = DI.orm.em;

    logger.info(
      "Conectado ao banco de dados Azure SQL com sucesso via MikroORM!",
    );
    return DI.orm;
  } catch (error) {
    logger.error("Erro ao conectar no banco de dados: ", error);
    throw error;
  }
};
