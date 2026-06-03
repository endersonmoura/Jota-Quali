import { CalibrationRepository } from "./calibration.repository";
import {
  SolicitarCalibracaoDTO,
  RegistrarCalibracaoInternaDTO,
} from "./calibration.dto";
import { AuditService } from "../audit/audit.service";
import AppError from "../../errors/AppError";

// Mock temporário para simular o uploadFile sem quebrar a compilação
const uploadFile = async (
  fileName: string,
  buffer: Buffer,
): Promise<string> => {
  return `https://storage.jotaquali.com/calibracoes/${fileName}`;
};

export class CalibrationService {
  private repository = new CalibrationRepository();
  private auditService = new AuditService();

  /**
   * C10: Solicitar calibração do equipamento
   */
  public async solicitarCalibracao(
    data: SolicitarCalibracaoDTO,
  ): Promise<string> {
    const solicitacaoId = await this.repository.createSolicitacao(data);

    // Regra Crítica 2: Auditar mutação de estado e acionamentos na DDL
    await this.auditService.log({
      userId: data.solicitanteId,
      action: "SOLICITAR_CALIBRACAO",
      resource: "solicitacao_calibracao",
      resourceId: solicitacaoId,
      details: `Tipo: ${data.tipo}, Prazo: ${data.prazoRetornoDias} dias`,
    });

    return solicitacaoId;
  }

  /**
   * C06: Registrar calibração interna
   */
  public async registrarCalibracaoInterna(
    data: RegistrarCalibracaoInternaDTO,
  ): Promise<string> {
    // Regra Crítica 3 (RN05): Verificar se o equipamento de referência possui calibração válida
    const validadeRef = await this.repository.getValidadeEquipamento(
      data.equipamentoReferenciaId,
    );
    if (!validadeRef || new Date(validadeRef) < new Date()) {
      throw new AppError(
        "Equipamento de referência com calibração vencida ou inexistente.",
        400,
        "REFERENCE_EXPIRED",
      );
    }

    const calibracaoId = await this.repository.createCalibracao(data);

    // Regra Crítica 1 (RN02 / C07): Gerar e salvar PDF da calibração
    const pdfBuffer = await this.gerarPdfCalibracao(data);
    const fileName = `calibracao_${calibracaoId}_${Date.now()}.pdf`;
    const fileUrl = await uploadFile(fileName, pdfBuffer);

    await this.repository.createDocumento(calibracaoId, fileUrl);

    // Regra Crítica 2: Rastreabilidade Obrigatória
    await this.auditService.log({
      userId: data.calibradorId,
      action: "REGISTRAR_CALIBRACAO_INTERNA",
      resource: "calibracao",
      resourceId: calibracaoId,
      details: `Equipamento de ref: ${data.equipamentoReferenciaId}`,
    });

    return calibracaoId;
  }

  /**
   * C07: Geração lógica do PDF da calibração
   * (Mock simplificado. Implementar motor de PDF como pdfkit/puppeteer).
   */
  private async gerarPdfCalibracao(
    data: RegistrarCalibracaoInternaDTO,
  ): Promise<Buffer> {
    const conteudoFakePdf = `
      CERTIFICADO DE CALIBRAÇÃO INTERNA
      Equipamento: ${data.equipamentoId}
      Equipamento Referência: ${data.equipamentoReferenciaId}
      Data Calibração: ${data.dataCalibracao.toISOString()}
    `;
    return Buffer.from(conteudoFakePdf, "utf-8");
  }
}
