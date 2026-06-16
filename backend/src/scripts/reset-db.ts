import { MikroORM } from "@mikro-orm/core";
import config from "../mikro-orm.config";

async function run() {
  const orm = await MikroORM.init(config);
  try {
    const em = orm.em.fork();

    console.log("Desativando chaves estrangeiras...");
    await em.execute("EXEC sp_MSForEachTable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL'");

    console.log("Limpando todas as tabelas...");
    await em.execute("EXEC sp_MSForEachTable 'DELETE FROM ?'");

    console.log("Reativando chaves estrangeiras...");
    await em.execute("EXEC sp_MSForEachTable 'ALTER TABLE ? WITH CHECK CHECK CONSTRAINT ALL'");

    console.log("✅ Banco de dados limpo com sucesso!");
  } catch (err) {
    console.error("Erro ao limpar o banco:", err);
  } finally {
    await orm.close();
  }
}

run();
