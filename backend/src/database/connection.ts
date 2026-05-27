import sql from "mssql";
import env from "../configs/env";
import logger from "../utils/logger";

let poolPromise: Promise<sql.ConnectionPool> | null = null;

function getConnectionConfig(): sql.config | string {
  const { database } = env;

  if (database.connectionString) {
    return database.connectionString;
  }

  if (!database.server || !database.user || !database.password) {
    throw new Error(
      "Missing database configuration. Set DB_CONNECTION_STRING or DB_SERVER, DB_USER and DB_PASSWORD.",
    );
  }

  return {
    server: database.server,
    port: database.port,
    user: database.user,
    password: database.password,
    database: database.name,
    options: {
      encrypt: database.encrypt,
      trustServerCertificate: database.trustServerCertificate,
    },
    pool: {
      min: database.poolMin,
      max: database.poolMax,
      idleTimeoutMillis: database.poolIdleTimeoutMs,
    },
  };
}

export async function getConnectionPool(): Promise<sql.ConnectionPool> {
  if (!poolPromise) {
    poolPromise = sql.connect(getConnectionConfig()).catch((error) => {
      poolPromise = null;
      throw error;
    });
  }

  return poolPromise;
}

export async function connectDatabase(): Promise<void> {
  await getConnectionPool();
  logger.info(`Connected to SQL Server database "${env.database.name}"`);
}

export async function closeDatabase(): Promise<void> {
  if (!poolPromise) {
    return;
  }

  const pool = await poolPromise;
  await pool.close();
  poolPromise = null;
}

export default {
  connectDatabase,
  closeDatabase,
  getConnectionPool,
};
