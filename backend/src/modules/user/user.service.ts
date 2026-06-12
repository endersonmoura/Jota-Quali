import { UserRepository } from "./user.repository";
import AppError from "../../errors/AppError";
import { UserResponseDTO } from "./user.dto";

export class UserService {
  private repository = new UserRepository();

  public async listUsers(): Promise<UserResponseDTO[]> {
    const users = await this.repository.findAll();
    return users.map((user) => ({
      id: user.id,
      name: user.nome,
      email: user.email,
      role: user.perfil ? String(user.perfil.nomePerfil || user.perfil.id || user.perfil) : "N/A",
      status: user.status,
      createdAt: user.criadoEm,
    }));
  }

  public async listPendingUsers(): Promise<UserResponseDTO[]> {
    const users = await this.repository.findPending();
    return users.map((user) => ({
      id: user.id,
      name: user.nome,
      email: user.email,
      role: user.perfil ? String(user.perfil.nomePerfil || user.perfil.id || user.perfil) : "N/A",
      status: user.status,
      createdAt: user.criadoEm,
    }));
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
}
