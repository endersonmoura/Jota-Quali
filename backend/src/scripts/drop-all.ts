import { MikroORM } from "@mikro-orm/core";
import config from "../mikro-orm.config";

async function run() {
  const orm = await MikroORM.init(config);
  try {
    const em = orm.em.fork();

    console.log("Apagando todas as chaves estrangeiras...");
    const dropFksSql = `
      DECLARE @sql NVARCHAR(max)=''
      SELECT @sql += 'ALTER TABLE ' + QUOTENAME(table_schema) + '.' + QUOTENAME(table_name) + ' DROP CONSTRAINT ' + QUOTENAME(constraint_name) + ';'
      FROM information_schema.table_constraints
      WHERE constraint_type = 'FOREIGN KEY'
      EXEC sp_executesql @sql
    `;
    await em.execute(dropFksSql);

    console.log("Apagando todas as tabelas (zerando o esquema)...");
    await em.execute("EXEC sp_MSForEachTable 'DROP TABLE ?'");

    console.log("✅ Banco de dados completamente apagado com sucesso!");
  } catch (err) {
    console.error("Erro ao apagar o esquema:", err);
  } finally {
    await orm.close();
  }
}

run();
