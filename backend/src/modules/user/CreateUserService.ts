import { createHash } from "crypto";
import { CreateUserDTO, User, UserResponse } from "../../@types";
import AppError from "../../errors/AppError";
import UserRepository from "./UserRepository";

class CreateUserService {
  constructor(private readonly userRepository = new UserRepository()) {}

  public async execute({
    name,
    email,
    password,
  }: CreateUserDTO): Promise<UserResponse> {
    const safeName = name?.trim();
    const safeEmail = email?.trim().toLowerCase();
    const safePassword = password?.trim();

    if (!safeName || !safeEmail || !safePassword) {
      throw new AppError(
        "name, email and password are required",
        400,
        "VALIDATION_ERROR",
      );
    }

    if (!this.isValidEmail(safeEmail)) {
      throw new AppError("invalid email format", 400, "INVALID_EMAIL");
    }

    if (safePassword.length < 6) {
      throw new AppError(
        "password must have at least 6 characters",
        400,
        "INVALID_PASSWORD",
      );
    }

    const existingUser = await this.userRepository.findByEmail(safeEmail);
    if (existingUser) {
      throw new AppError(
        "email already registered",
        409,
        "EMAIL_ALREADY_EXISTS",
      );
    }

    const user = await this.userRepository.create({
      name: safeName,
      email: safeEmail,
      passwordHash: this.hashPassword(safePassword),
    });

    return this.toUserResponse(user);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private hashPassword(password: string): string {
    return createHash("sha256").update(password).digest("hex");
  }

  private toUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}

export default CreateUserService;
