import type { EntityManager } from "@mikro-orm/mssql" with {
  "resolution-mode": "import",
};
import { DI } from "../../configs/db";
import { Usuario } from "../../configs/usuario.entity";
import { CreateUserRecordDTO } from "./user.dto";

export class UserRepository {
  private get em(): EntityManager {
    const { RequestContext } = require("@mikro-orm/core");
    return (RequestContext.getEntityManager() as EntityManager) || DI.em.fork();
  }

  public async findByEmail(email: string): Promise<Usuario | null> {
    return this.em.findOne(Usuario, { email });
  }

  public async findById(id: number): Promise<Usuario | null> {
    return this.em.findOne(Usuario, { id }, { populate: ['perfil'] });
  }

  public async count(): Promise<number> {
    return this.em.count(Usuario);
  }

  public async findAll(): Promise<Usuario[]> {
    return this.em.find(Usuario, {}, { populate: ['perfil'] });
  }

  public async findPending(): Promise<Usuario[]> {
    return this.em.find(Usuario, { status: "inativo" }, { populate: ['perfil'] });
  }

  public update(user: Usuario, data: Partial<Usuario>): void {
    this.em.assign(user, data);
  }

  public async flush(): Promise<void> {
    await this.em.flush();
  }

  public async create(data: CreateUserRecordDTO): Promise<Usuario> {
    const user = this.em.create(Usuario, {
      nome: data.name,
      email: data.email,
      senhaHash: data.passwordHash,
      cpf: data.cpf,
      perfil: data.perfilId,
      status: data.status,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    });
    this.em.persist(user);
    await this.em.flush();
    return user;
  }
}
