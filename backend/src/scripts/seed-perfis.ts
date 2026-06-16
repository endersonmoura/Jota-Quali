import { MikroORM } from "@mikro-orm/core";
import config from "../mikro-orm.config";
import { Perfil } from "../configs/perfil.entity";

async function run() {
  const orm = await MikroORM.init(config);
  try {
    const em = orm.em.fork();

    const perfis = [
      { id: 1, nomePerfil: "Administrador", permissoes: "{}" },
      { id: 2, nomePerfil: "Consulta", permissoes: "{}" },
      { id: 3, nomePerfil: "Calibrador", permissoes: "{}" },
      { id: 4, nomePerfil: "Operacional", permissoes: "{}" },
    ];

    for (const p of perfis) {
      const existing = await em.findOne(Perfil, { id: p.id });
      if (!existing) {
        em.create(Perfil, p);
      }
    }

    await em.flush();
    console.log("✅ Perfis padrão recriados com sucesso!");
  } catch (err) {
    console.error("Erro ao criar perfis:", err);
  } finally {
    await orm.close();
  }
}

run();
