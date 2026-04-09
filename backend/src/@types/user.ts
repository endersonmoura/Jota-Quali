export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}
