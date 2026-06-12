import { AuditRepository } from "./audit.repository";
import { CreateAuditDTO, AuditResponseDTO } from "./audit.dto";
import logger from "../../utils/logger";

export class AuditService {
  private repository = new AuditRepository();

  public async log(data: CreateAuditDTO): Promise<void> {
    try {
      await this.repository.create(data);
      // RNF05: Gravar a ação crítica no logger para rastreabilidade de sistema
      logger.info(
        `[AUDIT] Usuário ${data.userId} realizou ${data.action} no recurso ${data.resource} (ID: ${data.resourceId || "N/A"})`,
      );
    } catch (error) {
      logger.error(
        `[AUDIT ERROR] Falha ao registrar log de auditoria para a ação ${data.action}:`,
        error,
      );
      throw error;
    }
  }

  public async getLogs(resourceId?: number): Promise<AuditResponseDTO[]> {
    const logs = await this.repository.findLogsByResource(resourceId);

    return logs.map((log) => ({
      id: log.id,
      userId: log.usuarioId,
      action: log.acao,
      resource: log.entidade,
      resourceId: log.entidadeId,
      details: log.detalhes,
      createdAt: log.dataHora,
    }));
  }
}
