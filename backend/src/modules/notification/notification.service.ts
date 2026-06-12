import { DI } from "../../configs/db";
import { Equipamento } from "../../configs/equipamento.entity";
import { Usuario } from "../../configs/usuario.entity";
import { NotificationRepository } from "./notification.repository";
import { EmailService } from "./email.service";
import logger from "../../utils/logger";

export class NotificationService {
  private repository = new NotificationRepository();
  private emailService = new EmailService();

  public async checkAndSendAlerts(): Promise<void> {
    const em = DI.em.fork();

    try {
      // Obter administradores (Perfil nomePerfil = "administrador")
      const administradores = await em.find(Usuario, {
        perfil: { nomePerfil: "administrador" },
        status: "ativo",
      });

      if (administradores.length === 0) {
        logger.warn("Cron de Notificação: Nenhum administrador encontrado. Abortando alertas.");
        return;
      }

      // Buscar equipamentos ativos que possuem dataVencimentoCalibracao e
      // que o status NÃO seja 'calibracao_solicitada' ou 'em_calibracao'
      const equipamentos = await em.find(Equipamento, {
        status: { $nin: ["calibracao_solicitada", "em_calibracao", "inativo"] },
        dataVencimentoCalibracao: { $ne: null },
      });

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0); // Zera hora para comparar apenas a data

      for (const eq of equipamentos) {
        if (!eq.dataVencimentoCalibracao) continue;

        const vencimento = new Date(eq.dataVencimentoCalibracao);
        vencimento.setHours(0, 0, 0, 0);

        const msPorDia = 1000 * 60 * 60 * 24;
        const diferencaMs = vencimento.getTime() - hoje.getTime();
        const diasRestantes = Math.round(diferencaMs / msPorDia);

        // Verifica se encaixa nas regras de RF42 a RF46
        const alvos = [60, 30, 15, 10, 7];

        if (alvos.includes(diasRestantes)) {
          const tipoAlerta = `${diasRestantes}_dias`;

          // Verificar se já foi enviado para esse equipamento com essa quantidade de dias
          const jaEnviado = await this.repository.hasNotificationBeenSent(eq.id, tipoAlerta);

          if (!jaEnviado) {
            // Se for 7 dias (RF46) vai pro superior. O usuário nos confirmou que
            // o Administrador faz as duas funções (admin e superior)
            // Então vamos enviar para todos os administradores cadastrados
            for (const admin of administradores) {
              const enviado = await this.emailService.sendExpirationAlert(
                admin.email,
                eq.codigo,
                eq.descricao,
                diasRestantes
              );

              if (enviado) {
                // Registrar log para RF47 (Histórico)
                await this.repository.saveNotification({
                  equipamento: eq,
                  destinatario: admin.email,
                  tipoAlerta,
                  dataHora: new Date(),
                });
              }
            }
          }
        }
      }
    } catch (error) {
      logger.error("Erro ao verificar alertas de calibração:", error);
    }
  }
}
