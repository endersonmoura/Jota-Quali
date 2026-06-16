export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  cpf?: string;
  avatarUrl?: string;
  createdAt: Date;
}

export interface CreateUserRecordDTO {
  name: string;
  email: string;
  passwordHash: string;
  cpf: string;
  perfilId: number;
  status: string;
}
