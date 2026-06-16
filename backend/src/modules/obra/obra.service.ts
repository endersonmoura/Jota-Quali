import { DI } from "../../configs/db";
import { Obra } from "../../configs/obra.entity";
import { CreateObraDTO, ObraDTO, UpdateObraDTO } from "./obra.dto";
import AppError from "../../errors/AppError";
import { RequestContext } from "@mikro-orm/core";

export class ObraService {
  private get em() {
    return (RequestContext.getEntityManager() || DI.em).fork();
  }

  public async listarObras(status?: string): Promise<ObraDTO[]> {
    const em = this.em;
    const query: any = {};
    if (status) {
      query.status = status;
    }
    const obras = await em.find(Obra, query, { orderBy: { nomeObra: "ASC" } });
    return obras.map((obra) => ({
      id: obra.id,
      nomeObra: obra.nomeObra,
      localizacao: obra.localizacao,
      status: obra.status,
    }));
  }

  public async criarObra(data: CreateObraDTO): Promise<ObraDTO> {
    const em = this.em;
    const obra = em.create(Obra, {
      nomeObra: data.nomeObra,
      localizacao: data.localizacao,
      status: "ativa",
      criadoPorId: data.criadoPorId,
      dataCadastro: new Date(),
      criadoEm: new Date(),
    });
    
    em.persist(obra);
    await em.flush();
    
    return {
      id: obra.id,
      nomeObra: obra.nomeObra,
      localizacao: obra.localizacao,
      status: obra.status,
    };
  }

  public async atualizarObra(id: number, data: UpdateObraDTO): Promise<ObraDTO> {
    const em = this.em;
    const obra = await em.findOne(Obra, { id });
    
    if (!obra) {
      throw new AppError("Obra não encontrada.", 404);
    }

    if (data.nomeObra !== undefined) obra.nomeObra = data.nomeObra;
    if (data.localizacao !== undefined) obra.localizacao = data.localizacao;
    if (data.status !== undefined) obra.status = data.status;

    await em.flush();

    return {
      id: obra.id,
      nomeObra: obra.nomeObra,
      localizacao: obra.localizacao,
      status: obra.status,
    };
  }
}
