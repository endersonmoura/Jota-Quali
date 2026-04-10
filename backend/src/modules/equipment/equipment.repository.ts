import * as sql from "mssql"; // retirar depois
import { IEquipment } from "../../@types";

export class EquipmentRepository {
  async create(data: IEquipment): Promise<void> {
    const query = `
            INSERT INTO Equipamentos (Nome, CodigoPatrimonio, Status, DataAquisicao)
            VALUES (@nome, @codigoPatrimonio, 'Disponivel', @dataAquisicao)
        `;
    const request = new sql.Request();
    request.input("nome", sql.VarChar, data.Nome);
    request.input("codigoPatrimonio", sql.VarChar, data.CodigoPatrimonio);
    request.input("dataAquisicao", sql.Date, data.DataAquisicao);

    await request.query(query);
  }

  async findAll(): Promise<IEquipment[]> {
    const query = `SELECT * FROM Equipamentos`;
    const result = await new sql.Request().query(query);
    return result.recordset;
  }

  async findById(id: string): Promise<IEquipment | null> {
    const query = `SELECT * FROM Equipamentos WHERE Id = @id`;
    const request = new sql.Request();
    request.input("id", sql.UniqueIdentifier, id);

    const result = await request.query(query);
    return result.recordset[0] || null;
  }

  async update(id: string, data: Partial<IEquipment>): Promise<void> {
    const query = `
            UPDATE Equipamentos 
            SET Nome = @nome, DataAquisicao = @dataAquisicao
            WHERE Id = @id
        `;
    const request = new sql.Request();
    request.input("id", sql.UniqueIdentifier, id);
    request.input("nome", sql.VarChar, data.Nome);
    request.input("dataAquisicao", sql.Date, data.DataAquisicao);

    await request.query(query);
  }

  async delete(id: string): Promise<void> {
    const query = `UPDATE Equipamentos SET Status = 'Inativo' WHERE Id = @id`;
    const request = new sql.Request();
    request.input("id", sql.UniqueIdentifier, id);

    await request.query(query);
  }
}
