import cron from "node-cron";
import { NotificationService } from "./notification.service";
import logger from "../../utils/logger";

export function initScheduler() {
  const notificationService = new NotificationService();

  // Executa todos os dias às 08:00 da manhã
  // "0 8 * * *" -> Minuto 0, Hora 8, Qualquer Dia, Qualquer Mês, Qualquer Dia da Semana
  cron.schedule("0 8 * * *", async () => {
    logger.info("Iniciando rotina de verificação de vencimento de calibrações...");
    await notificationService.checkAndSendAlerts();
    logger.info("Rotina de verificação finalizada.");
  });

  logger.info("Módulo Scheduler: Rotina de notificação de calibrações (cron) registrada para rodar às 08:00 todos os dias.");
}
