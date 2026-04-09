import { User } from "../@types";

interface DatabaseSchema {
  users: User[];
}

class InMemoryConnection {
  private readonly schema: DatabaseSchema = {
    users: []
  };

  public users(): User[] {
    return this.schema.users;
  }
}

const connection = new InMemoryConnection();

export default connection;
