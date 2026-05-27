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

    let user: User;

    try {
      user = await this.userRepository.create({
        name: safeName,
        email: safeEmail,
        passwordHash: this.hashPassword(safePassword),
      });
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new AppError(
          "email already registered",
          409,
          "EMAIL_ALREADY_EXISTS",
        );
      }

      throw error;
    }

    return this.toUserResponse(user);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private hashPassword(password: string): string {
    return createHash("sha256").update(password).digest("hex");
  }

  private isUniqueConstraintError(error: unknown): boolean {
    if (!(error instanceof Error)) {
      return false;
    }

    const details = error as Error & {
      code?: string;
      number?: number;
      originalError?: { info?: { number?: number } };
      precedingErrors?: Array<{ number?: number }>;
    };

    const duplicatedKeyNumbers = [2601, 2627];
    const codes = new Set([details.code, details.number?.toString()]);

    if (codes.has("EREQUEST")) {
      const originalNumber = details.originalError?.info?.number;
      if (originalNumber && duplicatedKeyNumbers.includes(originalNumber)) {
        return true;
      }

      if (
        details.precedingErrors?.some(
          (item) =>
            typeof item.number === "number" &&
            duplicatedKeyNumbers.includes(item.number),
        )
      ) {
        return true;
      }
    }

    return false;
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
