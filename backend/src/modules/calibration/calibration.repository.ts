import type { EntityManager, EntityRepository } from "@mikro-orm/mssql" with {
  "resolution-mode": "import",
};
import { DI } from "../../configs/db";
import {
  SolicitarCalibracaoDTO,
  RegistrarCalibracaoInternaDTO,
} from "./calibration.dto";
import { Calibracao } from "../../configs/calibracao.entity";
import { SolicitacaoCalibracao } from "../../configs/solicitacao-calibracao.entity";
import { Documento } from "../../configs/documento.entity";
import { PadraoReferencia } from "../../configs/padrao-referencia.entity";

export class CalibrationRepository {
  private get em(): EntityManager {
    return DI.em.fork();
  }

  /**
   * Método solicitado de Exemplo: Busca uma calibração por ID com relacionamentos populados
   */
  public async getCalibracaoComDetalhes(
    id: number,
  ): Promise<Calibracao | null> {
    const em = this.em;
    return em.findOne(
      Calibracao,
      { id },
      {
        populate: ["equipamento", "documentos", "recursos"],
      },
    );
  }

  public async createSolicitacao(
    data: SolicitarCalibracaoDTO,
  ): Promise<number> {
    const em = this.em;
    const solicitacao = em.create(SolicitacaoCalibracao, {
      equipamento: data.equipamentoId, // MikroORM injeta automaticamente como referência (FK)
      tipoCalibracao: data.tipo,
      prazoRetorno: new Date(Date.now() + data.prazoRetornoDias * 86400000),
      usuarioSolicitante: data.solicitanteId,
      status: "aberta",
      dataSolicitacao: new Date(),
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    });
    em.persist(solicitacao);
    await em.flush();
    return solicitacao.id;
  }

  public async getValidadeEquipamento(
    equipamentoReferenciaId: number,
  ): Promise<Date | null> {
    const em = this.em;
    const padrao = await em.findOne(PadraoReferencia, { id: equipamentoReferenciaId });
    return padrao?.validade || null;
  }

  public async createCalibracao(
    data: RegistrarCalibracaoInternaDTO,
  ): Promise<number> {
    const em = this.em;
    const calibracao = em.create(Calibracao, {
      equipamento: data.equipamentoId,
      padraoReferencia: data.equipamentoReferenciaId,
      tipo: "interna",
      dataRealizacao: data.dataCalibracao,
      dataValidade: data.validade,
      usuario: data.calibradorId,
      status: "pendente_documento",
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    });
    em.persist(calibracao);
    await em.flush();
    return calibracao.id;
  }

  public async createDocumento(
    calibracaoId: number,
    url: string,
  ): Promise<number> {
    const em = this.em;
    const documento = em.create(Documento, {
      calibracao: calibracaoId,
      pathArquivo: url,
      statusAssinatura: false,
      tipoDocumental: "pdf_calibracao_interna",
      dataEmissao: new Date(),
      dataVencimento: new Date(Date.now() + 365*86400000), // temp
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    });
    em.persist(documento);
    await em.flush();
    return documento.id;
  }
}
