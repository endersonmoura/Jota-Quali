import { api } from "../api";

export interface NotificationDTO {
  id: number;
  equipamento: {
    id: number;
    codigo: string;
    descricao: string;
  } | null;
  tipoAlerta: string;
  lida: boolean;
  dataHora: string;
}

export interface NotificationResponse {
  data: NotificationDTO[];
  unreadCount: number;
}

export const notificationService = {
  async getMyNotifications(): Promise<NotificationResponse> {
    const response = await api.get("/notificacoes");
    return {
      data: response.data.data,
      unreadCount: response.data.unreadCount,
    };
  },

  async markAsRead(id: number): Promise<void> {
    await api.patch(`/notificacoes/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.patch("/notificacoes/read-all");
  },
};
