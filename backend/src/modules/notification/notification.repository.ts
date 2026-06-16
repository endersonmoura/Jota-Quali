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

  public async findByUser(email: string): Promise<Notificacao[]> {
    const em = this.em;
    return em.find(Notificacao, { destinatario: email }, { orderBy: { dataHora: "DESC" }, populate: ["equipamento"] });
  }

  public async getUnreadCount(email: string): Promise<number> {
    const em = this.em;
    return em.count(Notificacao, { destinatario: email, lida: false });
  }

  public async markAsRead(id: number, email: string): Promise<void> {
    const em = this.em;
    const notificacao = await em.findOne(Notificacao, { id, destinatario: email });
    if (notificacao) {
      notificacao.lida = true;
      await em.flush();
    }
  }

  public async markAllAsRead(email: string): Promise<void> {
    const em = this.em;
    const notificacoes = await em.find(Notificacao, { destinatario: email, lida: false });
    for (const notif of notificacoes) {
      notif.lida = true;
    }
    await em.flush();
  }
}
