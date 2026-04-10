import { randomUUID } from "crypto";
import { User } from "../../@types";
import connection from "../../database/connection";

interface CreateUserRecord {
  name: string;
  email: string;
  passwordHash: string;
}

class UserRepository {
  private readonly users = connection.users();

  public async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((item) => item.email === email);
    return user ?? null;
  }

  public async findById(id: string): Promise<User | null> {
    const user = this.users.find((item) => item.id === id);
    return user ?? null;
  }

  public async create(data: CreateUserRecord): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      createdAt: new Date(),
    };

    this.users.push(user);
    return user;
  }
}

export default UserRepository;
