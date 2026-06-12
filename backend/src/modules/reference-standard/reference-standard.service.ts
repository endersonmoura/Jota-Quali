import { ReferenceStandardRepository } from "./reference-standard.repository";
import { PadraoReferencia } from "../../configs/padrao-referencia.entity";
import { CreateReferenceStandardDTO, UpdateReferenceStandardDTO } from "./reference-standard.dto";
import AppError from "../../errors/AppError";

export class ReferenceStandardService {
  private repository = new ReferenceStandardRepository();

  public async create(data: CreateReferenceStandardDTO): Promise<PadraoReferencia> {
    const existing = await this.repository.findByCodigo(data.codigo);
    if (existing) {
      throw new AppError("Já existe um Padrão de Referência com este código.", 409);
    }

    return await this.repository.create({
      codigo: data.codigo,
      descricao: data.descricao,
      tipo: data.tipo,
      validade: data.validade ? new Date(data.validade) : undefined,
      status: "disponivel",
      situacaoDocumental: "regular",
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    });
  }

  public async getAll(): Promise<PadraoReferencia[]> {
    return await this.repository.findAll();
  }

  public async getById(id: number): Promise<PadraoReferencia> {
    const padrao = await this.repository.findById(id);
    if (!padrao) {
      throw new AppError("Padrão de Referência não encontrado.", 404);
    }
    return padrao;
  }

  public async update(id: number, data: UpdateReferenceStandardDTO): Promise<PadraoReferencia> {
    const padrao = await this.getById(id);

    return await this.repository.update(padrao, {
      descricao: data.descricao ?? padrao.descricao,
      tipo: data.tipo ?? padrao.tipo,
      validade: data.validade ? new Date(data.validade) : padrao.validade,
      status: data.status ?? padrao.status,
      situacaoDocumental: data.situacaoDocumental ?? padrao.situacaoDocumental,
    });
  }

  public async delete(id: number): Promise<void> {
    const padrao = await this.getById(id);
    // Inativação lógica conforme padrão do sistema
    await this.repository.update(padrao, { status: "inativo" });
  }
}
