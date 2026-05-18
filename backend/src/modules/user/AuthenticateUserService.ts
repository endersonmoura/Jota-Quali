import { createHash, createHmac, timingSafeEqual } from "crypto";
import { LoginDTO, LoginResponse, TokenPayload, User, UserResponse } from "../../@types";
import env from "../../configs/env";
import AppError from "../../errors/AppError";
import UserRepository from "./UserRepository";

class AuthenticateUserService {
  constructor(private readonly userRepository = new UserRepository()) {}

  public async execute({ email, password }: LoginDTO): Promise<LoginResponse> {
    const safeEmail = email?.trim().toLowerCase();
    const safePassword = password?.trim();

    if (!safeEmail || !safePassword) {
      throw new AppError("email and password are required", 400, "VALIDATION_ERROR");
    }

    const user = await this.userRepository.findByEmail(safeEmail);
    if (!user || !this.isPasswordValid(safePassword, user.passwordHash)) {
      throw new AppError("invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    const { token, expiresIn } = this.signToken({
      sub: user.id,
      email: user.email
    });

    return {
      token,
      tokenType: "Bearer",
      expiresIn,
      user: this.toUserResponse(user)
    };
  }

  private hashPassword(password: string): string {
    return createHash("sha256").update(password).digest("hex");
  }

  private isPasswordValid(password: string, expectedHash: string): boolean {
    const currentHash = this.hashPassword(password);

    const expected = Buffer.from(expectedHash, "hex");
    const current = Buffer.from(currentHash, "hex");

    if (expected.length !== current.length) {
      return false;
    }

    return timingSafeEqual(expected, current);
  }

  private signToken(payload: TokenPayload): { token: string; expiresIn: number } {
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresIn = env.authTokenTtlSeconds;

    const header = this.toBase64Url(
      JSON.stringify({
        alg: "HS256",
        typ: "JWT"
      })
    );

    const body = this.toBase64Url(
      JSON.stringify({
        ...payload,
        iat: issuedAt,
        exp: issuedAt + expiresIn
      })
    );

    const signature = createHmac("sha256", env.authSecret)
      .update(`${header}.${body}`)
      .digest("base64url");

    return {
      token: `${header}.${body}.${signature}`,
      expiresIn
    };
  }

  private toBase64Url(value: string): string {
    return Buffer.from(value).toString("base64url");
  }

  private toUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
  }
}

export default AuthenticateUserService;
