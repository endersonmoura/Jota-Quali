import nodemailer from "nodemailer";
import env from "../../configs/env";
import logger from "../../utils/logger";

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
      },
    });
  }

  public async sendExpirationAlert(
    to: string,
    equipamentoCodigo: string,
    equipamentoDescricao: string,
    diasRestantes: number
  ): Promise<boolean> {
    try {
      const subject = `[JotaQuali] Alerta: Calibração a vencer em ${diasRestantes} dias!`;
      const text = `
Olá,

Este é um alerta automático do sistema JotaQuali.

A calibração do seguinte equipamento está prestes a vencer:
- Código: ${equipamentoCodigo}
- Descrição: ${equipamentoDescricao}
- Vence em: ${diasRestantes} dias

Por favor, acesse o sistema para solicitar a calibração do equipamento.

Atenciosamente,
Sistema JotaQuali
      `.trim();

      const html = `
        <h3>Alerta de Vencimento de Calibração</h3>
        <p>Olá,</p>
        <p>Este é um alerta automático do sistema <b>JotaQuali</b>.</p>
        <p>A calibração do seguinte equipamento está prestes a vencer:</p>
        <ul>
          <li><b>Código:</b> ${equipamentoCodigo}</li>
          <li><b>Descrição:</b> ${equipamentoDescricao}</li>
          <li><b>Vence em:</b> <span style="color: red; font-weight: bold;">${diasRestantes} dias</span></li>
        </ul>
        <p>Por favor, acesse o sistema para registrar a solicitação de calibração.</p>
        <br />
        <p>Atenciosamente,<br/>Sistema JotaQuali</p>
      `;

      await this.transporter.sendMail({
        from: `"JotaQuali" <${env.smtpFrom}>`,
        to,
        subject,
        text,
        html,
      });

      logger.info(`E-mail de alerta de vencimento (${diasRestantes} dias) enviado para ${to} sobre o equipamento ${equipamentoCodigo}.`);
      return true;
    } catch (error) {
      logger.error(`Erro ao enviar e-mail de alerta para ${to}:`, error);
      return false;
    }
  }
}
