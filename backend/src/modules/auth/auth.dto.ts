import { UserResponseDTO } from "../user/user.dto";

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  cpf: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface TokenPayload {
  sub: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: UserResponseDTO;
}
