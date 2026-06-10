export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: "ADMINISTRADOR" | "CALIBRADOR" | "OPERACIONAL" | "CONSULTA";
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
}

export interface CreateUserRecordDTO {
  name: string;
  email: string;
  passwordHash: string;
  role: "ADMINISTRADOR" | "CALIBRADOR" | "OPERACIONAL" | "CONSULTA";
  status: "PENDING" | "APPROVED" | "REJECTED";
}
