import bcrypt from "bcrypt";
import { createHmac } from "crypto";
import { UserRepository } from "../user/user.repository";
import {
  CreateUserDTO,
  LoginDTO,
  LoginResponse,
  TokenPayload,
} from "./auth.dto";
import { UserResponseDTO } from "../user/user.dto";
import { Usuario } from "../../configs/usuario.entity";
import env from "../../configs/env";
import AppError from "../../errors/AppError";
import { DI } from "../../configs/db";

export class AuthService {
  private repository = new UserRepository();

  public async register(data: CreateUserDTO): Promise<UserResponseDTO> {
    const safeEmail = data.email?.trim().toLowerCase();

    if (await this.repository.findByEmail(safeEmail)) {
      throw new AppError("E-mail já cadastrado", 409, "EMAIL_ALREADY_EXISTS");
    }

    // Regra Definida: O primeiro usuario a se cadastrar ganha aprovação e admin automaticamente
    const isFirstUser = (await this.repository.count()) === 0;

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await this.repository.create({
      name: data.name.trim(),
      email: safeEmail,
      passwordHash,
      cpf: data.cpf,
      perfilId: isFirstUser ? 1 : 4,
      status: isFirstUser ? "ativo" : "inativo",
    });

    // Enfileira a criação do usuário e dispara efetivamente o INSERT no banco
    DI.em.persist(user);
    await DI.em.flush();

    return this.toUserResponse(user);
  }

  public async login(data: LoginDTO): Promise<LoginResponse> {
    const safeEmail = data.email?.trim().toLowerCase();
    const user = await this.repository.findByEmail(safeEmail);

    if (!user || !(await bcrypt.compare(data.password, user.senhaHash))) {
      throw new AppError("Credenciais inválidas", 401, "INVALID_CREDENTIALS");
    }

    // Validando o status do usuário recém cadastrado
    if (user.status === "inativo") {
      throw new AppError(
        "Sua conta aguarda aprovação do Administrador (inativa).",
        403,
        "PENDING_APPROVAL",
      );
    }

    const { token, expiresIn } = this.signToken({
      sub: user.id.toString(),
      email: user.email,
    });

    return {
      token,
      tokenType: "Bearer",
      expiresIn,
      user: this.toUserResponse(user),
    };
  }

  private signToken(payload: TokenPayload): {
    token: string;
    expiresIn: number;
  } {
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresIn = env.authTokenTtlSeconds || 86400;

    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" }))
      .toString("base64url")
      .replace(/=/g, "");
    const body = Buffer.from(
      JSON.stringify({ ...payload, iat: issuedAt, exp: issuedAt + expiresIn }),
    )
      .toString("base64url")
      .replace(/=/g, "");

    const signature = createHmac("sha256", env.authSecret || "secret")
      .update(`${header}.${body}`)
      .digest("base64url");

    return { token: `${header}.${body}.${signature}`, expiresIn };
  }

  private toUserResponse(user: Usuario): UserResponseDTO {
    return {
      id: user.id,
      name: user.nome,
      email: user.email,
      role: user.perfil ? String(user.perfil.id || user.perfil) : "N/A",
      status: user.status,
      createdAt: user.criadoEm,
    };
  }
}
