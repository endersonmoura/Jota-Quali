import { DocumentRepository } from "./document.repository";
import { UploadLaudoDTO, AssinarDocumentoDTO } from "./document.dto";
import AppError from "../../errors/AppError";
import { AuditService } from "../audit/audit.service";

export class DocumentService {
  private repository = new DocumentRepository();
  private auditService = new AuditService();

  public async listarDocumentos() {
    return await this.repository.findAll();
  }

  public async getDocumentoById(id: number) {
    const doc = await this.repository.getDocumentoById(id);
    if (!doc) throw new AppError("Documento não encontrado.", 404);
    return doc;
  }

  public async uploadLaudo(data: UploadLaudoDTO): Promise<number> {
    // RN01: O laudo entra "pendente_assinatura".
    const documentoId = await this.repository.createLaudo(data);

    // Se houver uma solicitacao, fecha-la
    if (data.solicitacaoId) {
      await this.repository.concluirSolicitacao(data.solicitacaoId);
    }

    // Atualizar status do equipamento para 'pendente_assinatura' (RN06)
    await this.repository.atualizarStatusEquipamento(data.equipamentoId, "pendente_assinatura");

    this.auditService.log({
      userId: 1,
      action: "UPLOAD_LAUDO",
      resource: "documento",
      resourceId: documentoId,
      details: `Laudo para eq. ${data.equipamentoId}`,
    });

    return documentoId;
  }

  public async assinarDocumento(data: AssinarDocumentoDTO): Promise<void> {
    const doc = await this.repository.getDocumentoById(data.documentoId);
    if (!doc) throw new AppError("Documento não encontrado.", 404);
    if (doc.statusAssinatura) throw new AppError("Documento já está assinado.", 400);

    // RN08: Assinatura
    await this.repository.assinarDocumento(data);

    // RN04: Liberar equipamento se for laudo e estiver vigente
    // Assumimos que a validade vigora
    if (doc.equipamento) {
       await this.repository.atualizarStatusEquipamento(doc.equipamento.id, "disponivel");
    }

    this.auditService.log({
      userId: data.assinanteId,
      action: "ASSINAR_DOCUMENTO",
      resource: "documento",
      resourceId: data.documentoId,
    });
  }

  public async excluirDocumento(id: number, userId: number): Promise<void> {
    const doc = await this.repository.getDocumentoById(id);
    if (!doc) throw new AppError("Documento não encontrado.", 404);

    await this.repository.deleteDocumento(id);

    this.auditService.log({
      userId,
      action: "EXCLUIR_DOCUMENTO",
      resource: "documento",
      resourceId: id,
    });
  }
}
