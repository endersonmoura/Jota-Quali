import sql from "mssql";
import { User } from "../../@types";
import { getConnectionPool } from "../../database/connection";

interface CreateUserRecord {
  name: string;
  email: string;
  passwordHash: string;
}

interface UserRow {
  id_usuario: string;
  nome: string;
  email: string;
  senha_hash: string;
  data_cadastro: Date;
}

class UserRepository {
  public async findByEmail(email: string): Promise<User | null> {
    const pool = await getConnectionPool();
    const request = pool.request();

    request.input("email", sql.NVarChar(254), email);

    const result = await request.query<UserRow>(`
      SELECT TOP (1)
        id_usuario,
        nome,
        email,
        senha_hash,
        data_cadastro
      FROM auth.usuario
      WHERE email = @email
        AND ativo = 1;
    `);

    const row = result.recordset[0];
    return row ? this.mapToDomain(row) : null;
  }

  public async findById(id: string): Promise<User | null> {
    const pool = await getConnectionPool();
    const request = pool.request();

    request.input("id_usuario", sql.UniqueIdentifier, id);

    const result = await request.query<UserRow>(`
      SELECT TOP (1)
        id_usuario,
        nome,
        email,
        senha_hash,
        data_cadastro
      FROM auth.usuario
      WHERE id_usuario = @id_usuario
        AND ativo = 1;
    `);

    const row = result.recordset[0];
    return row ? this.mapToDomain(row) : null;
  }

  public async create(data: CreateUserRecord): Promise<User> {
    const pool = await getConnectionPool();
    const request = pool.request();

    request.input("nome", sql.NVarChar(150), data.name);
    request.input("email", sql.NVarChar(254), data.email);
    request.input("senha_hash", sql.NVarChar(255), data.passwordHash);

    const result = await request.query<UserRow>(`
      INSERT INTO auth.usuario (nome, email, senha_hash, ativo)
      OUTPUT
        INSERTED.id_usuario,
        INSERTED.nome,
        INSERTED.email,
        INSERTED.senha_hash,
        INSERTED.data_cadastro
      VALUES (@nome, @email, @senha_hash, 1);
    `);

    return this.mapToDomain(result.recordset[0]);
  }

  private mapToDomain(row: UserRow): User {
    return {
      id: row.id_usuario,
      name: row.nome,
      email: row.email,
      passwordHash: row.senha_hash,
      createdAt: row.data_cadastro,
    };
  }
}

export default UserRepository;
