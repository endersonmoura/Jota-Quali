import { Request, Response, NextFunction } from "express";
import { NotificationRepository } from "./notification.repository";
import { UserRepository } from "../user/user.repository";

export class NotificationController {
  private repository = new NotificationRepository();
  private userRepo = new UserRepository();

  public getMyNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = res.locals.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: "Não autorizado." });
        return;
      }
      const user = await this.userRepo.findById(Number(userId));
      const email = user?.email;
      if (!email) {
        res.status(404).json({ success: false, message: "Usuário não encontrado." });
        return;
      }

      const notifications = await this.repository.findByUser(email);
      const unreadCount = await this.repository.getUnreadCount(email);

      res.status(200).json({
        success: true,
        data: notifications.map((n) => ({
          id: n.id,
          equipamento: n.equipamento ? { id: n.equipamento.id, codigo: n.equipamento.codigo, descricao: n.equipamento.descricao } : null,
          tipoAlerta: n.tipoAlerta,
          lida: n.lida,
          dataHora: n.dataHora,
        })),
        unreadCount,
      });
    } catch (error) {
      next(error);
    }
  };

  public markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = res.locals.user?.id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ success: false, message: "Não autorizado." });
        return;
      }
      const user = await this.userRepo.findById(Number(userId));
      const email = user?.email;
      if (!email) {
        res.status(404).json({ success: false, message: "Usuário não encontrado." });
        return;
      }

      await this.repository.markAsRead(Number(id), email);
      res.status(200).json({ success: true, message: "Notificação lida." });
    } catch (error) {
      next(error);
    }
  };

  public markAllAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = res.locals.user?.id;

      if (!userId) {
        res.status(401).json({ success: false, message: "Não autorizado." });
        return;
      }
      const user = await this.userRepo.findById(Number(userId));
      const email = user?.email;
      if (!email) {
        res.status(404).json({ success: false, message: "Usuário não encontrado." });
        return;
      }

      await this.repository.markAllAsRead(email);
      res.status(200).json({ success: true, message: "Todas notificações lidas." });
    } catch (error) {
      next(error);
    }
  };
}
