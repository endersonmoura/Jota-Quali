import type { EntityManager, RequiredEntityData } from "@mikro-orm/mssql" with {
  "resolution-mode": "import",
};
import { DI } from "../../configs/db";
import { Notificacao } from "../../configs/notificacao.entity";

export class NotificationRepository {
  private get em(): EntityManager {
    return DI.em.fork();
  }

  public async saveNotification(data: RequiredEntityData<Notificacao>): Promise<Notificacao> {
    const em = this.em;
    const notificacao = em.create(Notificacao, data);
    em.persist(notificacao);
    await em.flush();
    return notificacao;
  }

  public async hasNotificationBeenSent(equipamentoId: number, tipoAlerta: string): Promise<boolean> {
    const em = this.em;
    const notificacao = await em.findOne(Notificacao, {
      equipamento: { id: equipamentoId },
      tipoAlerta,
    });
    return !!notificacao;
  }
}
