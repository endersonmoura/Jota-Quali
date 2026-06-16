import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bell, AlertTriangle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService, NotificationDTO } from "@/services/notification/notification.service";
import styles from "./NotificationPopover.module.css";

interface Props {
  onClose: () => void;
}

function getNotificationContent(n: NotificationDTO) {
  const daysMatch = n.tipoAlerta.match(/^(\d+)_dias$/);
  if (daysMatch) {
    const days = daysMatch[1];
    return {
      title: "Alerta de Calibração",
      message: `O equipamento ${n.equipamento?.codigo} (${n.equipamento?.descricao}) vence em ${days} dias.`,
    };
  }
  return {
    title: "Notificação",
    message: "Você tem um novo alerta no sistema.",
  };
}

export function NotificationPopover({ onClose }: Props) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationService.getMyNotifications(),
  });

  const markAsRead = useMutation({
    mutationFn: (id: number) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleNotificationClick = (n: NotificationDTO) => {
    if (!n.lida) {
      markAsRead.mutate(n.id);
    }
  };

  const notifications = data?.data || [];

  return (
    <div className={styles.popover} onClick={(e) => e.stopPropagation()}>
      <div className={styles.header}>
        <h3 className={styles.title}>Notificações</h3>
        {data?.unreadCount ? (
          <button
            className={styles.markAllBtn}
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
          >
            Marcar todas como lidas
          </button>
        ) : null}
      </div>

      <div className={styles.list}>
        {isLoading ? (
          <div className={styles.empty}>Carregando...</div>
        ) : notifications.length === 0 ? (
          <div className={styles.empty}>Nenhuma notificação recebida.</div>
        ) : (
          notifications.map((n) => {
            const content = getNotificationContent(n);
            return (
              <div
                key={n.id}
                className={`${styles.item} ${!n.lida ? styles.itemUnread : ""}`}
                onClick={() => handleNotificationClick(n)}
              >
                <div className={styles.itemIcon}>
                  <AlertTriangle size={16} />
                </div>
                <div className={styles.itemContent}>
                  <span className={styles.itemTitle}>{content.title}</span>
                  <span className={styles.itemMessage}>{content.message}</span>
                  <span className={styles.itemTime}>
                    {formatDistanceToNow(new Date(n.dataHora), { addSuffix: true, locale: ptBR })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
