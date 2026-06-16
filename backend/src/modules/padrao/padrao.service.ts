import { PadraoRepository } from "./padrao.repository";
import { CreatePadraoDTO, UpdatePadraoDTO, PadraoResponseDTO } from "./padrao.dto";
import { PadraoReferencia } from "../../configs/padrao-referencia.entity";
import AppError from "../../errors/AppError";

export class PadraoService {
  private repository = new PadraoRepository();

  public async listPadroes(): Promise<PadraoResponseDTO[]> {
    const padroes = await this.repository.findAll();
    return padroes.map((p) => this.toResponse(p));
  }

  public async getPadrao(id: number): Promise<PadraoResponseDTO> {
    const padrao = await this.repository.findById(id);
    if (!padrao || padrao.status === "inativo") {
      throw new AppError("Padrão não encontrado", 404);
    }
    return this.toResponse(padrao);
  }

  public async createPadrao(data: CreatePadraoDTO): Promise<PadraoResponseDTO> {
    const existing = await this.repository.findByCodigo(data.codigo);
    if (existing && existing.status !== "inativo") {
      throw new AppError("Já existe um padrão com esse código", 400);
    }

    const padrao = new PadraoReferencia();
    padrao.codigo = data.codigo;
    padrao.descricao = data.descricao;
    padrao.tipo = data.tipo || "";
    if (data.validade) padrao.validade = new Date(data.validade);
    padrao.status = data.status || "disponivel";
    padrao.situacaoDocumental = data.situacaoDocumental || "regular";

    this.repository.create(padrao);
    await this.repository.flush();

    return this.toResponse(padrao);
  }

  public async updatePadrao(id: number, data: UpdatePadraoDTO): Promise<PadraoResponseDTO> {
    const padrao = await this.repository.findById(id);
    if (!padrao || padrao.status === "inativo") {
      throw new AppError("Padrão não encontrado", 404);
    }

    if (data.codigo && data.codigo !== padrao.codigo) {
      const existing = await this.repository.findByCodigo(data.codigo);
      if (existing && existing.status !== "inativo") {
        throw new AppError("Já existe outro padrão com esse código", 400);
      }
    }

    const changes: Partial<PadraoReferencia> = {};
    if (data.codigo !== undefined) changes.codigo = data.codigo;
    if (data.descricao !== undefined) changes.descricao = data.descricao;
    if (data.tipo !== undefined) changes.tipo = data.tipo;
    if (data.status !== undefined) changes.status = data.status;
    if (data.situacaoDocumental !== undefined) changes.situacaoDocumental = data.situacaoDocumental;
    if (data.validade !== undefined) changes.validade = data.validade ? new Date(data.validade) : undefined;

    this.repository.update(padrao, changes);
    await this.repository.flush();

    return this.toResponse(padrao);
  }

  public async inativarPadrao(id: number): Promise<void> {
    const padrao = await this.repository.findById(id);
    if (!padrao || padrao.status === "inativo") {
      throw new AppError("Padrão não encontrado", 404);
    }
    this.repository.update(padrao, { status: "inativo" });
    await this.repository.flush();
  }

  private toResponse(padrao: PadraoReferencia): PadraoResponseDTO {
    return {
      id: padrao.id,
      codigo: padrao.codigo,
      descricao: padrao.descricao,
      tipo: padrao.tipo || "",
      status: padrao.status,
      situacaoDocumental: padrao.situacaoDocumental,
      validade: padrao.validade ? padrao.validade.toISOString() : undefined,
    };
  }
}
