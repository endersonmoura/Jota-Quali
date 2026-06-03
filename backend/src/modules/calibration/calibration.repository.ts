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

export class CalibrationRepository {
  private get em(): EntityManager {
    return DI.em.fork();
  }

  /**
   * Método solicitado de Exemplo: Busca uma calibração por ID com relacionamentos populados
   */
  public async getCalibracaoComDetalhes(
    id: string,
  ): Promise<Calibracao | null> {
    return this.em.findOne(
      Calibracao,
      { id },
      {
        populate: ["equipamento", "documentos", "recursos"],
      },
    );
  }

  public async createSolicitacao(
    data: SolicitarCalibracaoDTO,
  ): Promise<string> {
    const solicitacao = this.em.create(SolicitacaoCalibracao, {
      equipamento: data.equipamentoId, // MikroORM injeta automaticamente como referência (FK)
      tipo: data.tipo,
      prazoRetornoDias: data.prazoRetornoDias,
      solicitanteId: data.solicitanteId,
      status: "PENDENTE",
      createdAt: new Date(),
    });
    this.em.persist(solicitacao);
    await this.em.flush();
    return solicitacao.id;
  }

  public async getValidadeEquipamento(
    equipamentoId: string,
  ): Promise<Date | null> {
    const calibracao = await this.em.findOne(
      Calibracao,
      { equipamento: equipamentoId },
      { orderBy: { dataCalibracao: "DESC" } },
    );
    return calibracao?.validade || null;
  }

  public async createCalibracao(
    data: RegistrarCalibracaoInternaDTO,
  ): Promise<string> {
    const calibracao = this.em.create(Calibracao, {
      equipamento: data.equipamentoId,
      equipamentoReferencia: data.equipamentoReferenciaId,
      dataCalibracao: data.dataCalibracao,
      validade: data.validade,
      calibradorId: data.calibradorId,
      createdAt: new Date(),
    });
    this.em.persist(calibracao);
    await this.em.flush();
    return calibracao.id;
  }

  public async createDocumento(
    calibracaoId: string,
    url: string,
  ): Promise<string> {
    const documento = this.em.create(Documento, {
      calibracao: calibracaoId,
      caminhoArquivo: url,
      assinado: false,
      createdAt: new Date(),
    });
    this.em.persist(documento);
    await this.em.flush();
    return documento.id;
  }
}
