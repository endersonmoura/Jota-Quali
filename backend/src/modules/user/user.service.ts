import { UserRepository } from "./user.repository";
import AppError from "../../errors/AppError";
import { UserResponseDTO } from "./user.dto";

export class UserService {
  private repository = new UserRepository();

  private mapRole(user: any): string {
    const roleMap: Record<string, string> = {
      "1": "admin",
      "2": "consulta",
      "3": "calibrador",
      "4": "operacional",
    };
    const perfilId = user.perfil ? String(user.perfil.id || user.perfil) : "";
    return roleMap[perfilId] || "aguardando_aprovacao";
  }

  public async listUsers(): Promise<UserResponseDTO[]> {
    const users = await this.repository.findAll();
    return users.map((user) => ({
      id: user.id,
      name: user.nome,
      email: user.email,
      role: this.mapRole(user),
      status: user.status,
      cpf: user.cpf,
      createdAt: user.criadoEm,
    }));
  }

  public async listPendingUsers(): Promise<UserResponseDTO[]> {
    const users = await this.repository.findPending();
    return users.map((user) => ({
      id: user.id,
      name: user.nome,
      email: user.email,
      role: this.mapRole(user),
      status: user.status,
      cpf: user.cpf,
      createdAt: user.criadoEm,
    }));
  }

  public async updateProfile(userId: number, data: { name?: string; email?: string; cpf?: string; gender?: string }): Promise<void> {
    const user = await this.repository.findById(userId);
    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    if (data.email && data.email !== user.email) {
      const emailExists = await this.repository.findByEmail(data.email);
      if (emailExists) {
        throw new AppError("Este e-mail já está em uso.", 409);
      }
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.nome = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.cpf !== undefined) updateData.cpf = data.cpf;

    this.repository.update(user, updateData);
    await this.repository.flush();
  }

  public async updateStatus(
    targetUserId: number,
    newStatus: string,
  ): Promise<void> {
    const user = await this.repository.findById(targetUserId);
    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    // Delegação para o Repositório e Commit Transacional (Unit of Work)
    this.repository.update(user, { status: newStatus });
    await this.repository.flush();
  }

  public async updateRole(
    targetUserId: number,
    newRole: string,
  ): Promise<void> {
    const user = await this.repository.findById(targetUserId);
    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    const roleMap: Record<string, number> = {
      "admin": 1,
      "consulta": 2,
      "calibrador": 3,
      "operacional": 4,
    };

    const perfilId = roleMap[newRole];
    if (!perfilId) {
      throw new AppError("Cargo inválido.", 400);
    }

    // Se estiver mudando o cargo, assumimos que também está aprovando o acesso (ativo)
    this.repository.update(user, { perfil: perfilId as any, status: "ativo" });
    await this.repository.flush();
  }
}
