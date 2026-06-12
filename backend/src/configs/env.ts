import "dotenv/config";

interface EnvConfig {
  port: number;
  nodeEnv: string;
  authSecret: string;
  authTokenTtlSeconds: number;
  dbServer?: string;
  dbPort: number;
  dbUser?: string;
  dbPassword?: string;
  dbName?: string;
}

function toPort(value: string | undefined, fallback: number): number {
  const parsed = Number(value);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

const env: EnvConfig = {
  port: toPort(process.env.PORT, 3333),
  nodeEnv: process.env.NODE_ENV || "development",
  authSecret: process.env.AUTH_SECRET || "default-secret-jotaquali",
  authTokenTtlSeconds: Number(process.env.AUTH_TOKEN_TTL_SECONDS) || 86400,
  dbServer: process.env.DB_SERVER,
  dbPort: toPort(process.env.DB_PORT, 1433),
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
};

export default env;
