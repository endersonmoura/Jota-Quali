import type { EntityManager } from "@mikro-orm/mssql" with {
  "resolution-mode": "import",
};
import { DI } from "../../configs/db";
import { Usuario } from "../../configs/usuario.entity";
import { CreateUserRecordDTO } from "./user.dto";

export class UserRepository {
  private get em(): EntityManager {
    return DI.em.fork();
  }

  public async findByEmail(email: string): Promise<Usuario | null> {
    return this.em.findOne(Usuario, { email });
  }

  public async findById(id: string): Promise<Usuario | null> {
    return this.em.findOne(Usuario, { id });
  }

  public async count(): Promise<number> {
    return this.em.count(Usuario);
  }

  public async findAll(): Promise<Usuario[]> {
    return this.em.find(Usuario, {});
  }

  public async findPending(): Promise<Usuario[]> {
    return this.em.find(Usuario, { status: "PENDING" });
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
      senha: data.passwordHash,
      perfil: data.role,
      status: data.status,
      createdAt: new Date(),
    });
    this.em.persist(user);
    await this.em.flush();
    return user;
  }
}
