import type { EntityManager } from "@mikro-orm/mssql" with {
  "resolution-mode": "import",
};
import { DI } from "../../configs/db";
import { UploadLaudoDTO, AssinarDocumentoDTO } from "./document.dto";
import { Documento } from "../../configs/documento.entity";
import { AssinaturaDigital } from "../../configs/assinatura-digital.entity";
import { Equipamento } from "../../configs/equipamento.entity";
import { SolicitacaoCalibracao } from "../../configs/solicitacao-calibracao.entity";

export class DocumentRepository {
  private get em(): EntityManager {
    return DI.em.fork();
  }

  public async getDocumentoById(id: number): Promise<Documento | null> {
    const em = this.em;
    return em.findOne(Documento, { id }, { populate: ["equipamento", "calibracao"] });
  }

  public async findAll(): Promise<Documento[]> {
    const em = this.em;
    return em.find(
      Documento,
      {}, // Return all documents
      { populate: ["equipamento", "equipamento.obra", "calibracao", "calibracao.equipamento", "calibracao.equipamento.obra"] }
    );
  }

  public async createLaudo(data: UploadLaudoDTO): Promise<number> {
    const em = this.em;
    const documento = em.create(Documento, {
      equipamento: data.equipamentoId,
      tipoDocumental: "laudo_laboratorial",
      dataEmissao: data.dataEmissao,
      dataVencimento: data.dataValidade,
      laboratorio: data.laboratorio,
      statusAssinatura: false,
      pathArquivo: data.pathArquivo,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    });
    em.persist(documento);

    // RN12 e RN04: Se houver solicitação aberta, a gente pode concluí-la. 
    // Mas faremos a mudança de status do equipamento no Service.
    await em.flush();
    return documento.id;
  }

  public async getSolicitacaoById(id: number): Promise<SolicitacaoCalibracao | null> {
    const em = this.em;
    return em.findOne(SolicitacaoCalibracao, { id });
  }

  public async assinarDocumento(data: AssinarDocumentoDTO): Promise<void> {
    const em = this.em;
    const assinatura = em.create(AssinaturaDigital, {
      documento: data.documentoId,
      usuario: data.assinanteId,
      ipOrigem: data.ipOrigem,
      dataHoraAssinatura: new Date(),
      hashAssinatura: "mocked-hash-256", // Simulação de hash da assinatura
      criadoEm: new Date(),
    });
    em.persist(assinatura);
    
    // Atualiza status do documento
    const doc = await em.findOneOrFail(Documento, { id: data.documentoId });
    doc.statusAssinatura = true;
    doc.pathArquivo = data.pathArquivoAssinado;
    doc.atualizadoEm = new Date();
    em.persist(doc);
    
    await em.flush();
  }

  public async atualizarStatusEquipamento(equipamentoId: number, status: string): Promise<void> {
    const em = this.em;
    const equipamento = await em.findOne(Equipamento, { id: equipamentoId });
    if (equipamento) {
      equipamento.status = status;
      equipamento.atualizadoEm = new Date();
      em.persist(equipamento);
      await em.flush();
    }
  }

  public async concluirSolicitacao(solicitacaoId: number): Promise<void> {
    const em = this.em;
    const solicitacao = await em.findOne(SolicitacaoCalibracao, { id: solicitacaoId });
    if (solicitacao) {
      solicitacao.status = "concluida";
      solicitacao.atualizadoEm = new Date();
      em.persist(solicitacao);
      await em.flush();
    }
  }

  public async deleteDocumento(id: number): Promise<void> {
    const em = this.em;
    const doc = await em.findOne(Documento, { id });
    if (doc) {
      em.remove(doc);
      await em.flush();
    }
  }
}
