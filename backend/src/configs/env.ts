interface EnvConfig {
  port: number;
  nodeEnv: string;
  authSecret: string;
  authTokenTtlSeconds: number;
  database: {
    connectionString?: string;
    server: string;
    port: number;
    user: string;
    password: string;
    name: string;
    encrypt: boolean;
    trustServerCertificate: boolean;
    poolMin: number;
    poolMax: number;
    poolIdleTimeoutMs: number;
  };
}

function toPort(value: string | undefined, fallback: number): number {
  const parsed = Number(value);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function toBoolean(value: string | undefined, fallback: boolean): boolean {
  if (!value) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();

  if (["1", "true", "yes", "y", "on"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "n", "off"].includes(normalized)) {
    return false;
  }

  return fallback;
}

function toOptionalString(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

const env: EnvConfig = {
  port: toPort(process.env.PORT, 3333),
  nodeEnv: process.env.NODE_ENV ?? "development",
  authSecret: process.env.AUTH_SECRET ?? "jota-quali-dev-secret",
  authTokenTtlSeconds: toPort(process.env.AUTH_TOKEN_TTL_SECONDS, 28800),
  database: {
    connectionString: toOptionalString(
      process.env.DB_CONNECTION_STRING ?? process.env.SQL_CONNECTION_STRING,
    ),
    server: process.env.DB_SERVER ?? process.env.SQL_SERVER ?? "",
    port: toPort(process.env.DB_PORT ?? process.env.SQL_PORT, 1433),
    user: process.env.DB_USER ?? process.env.SQL_USER ?? "",
    password: process.env.DB_PASSWORD ?? process.env.SQL_PASSWORD ?? "",
    name: process.env.DB_NAME ?? process.env.SQL_DATABASE ?? "JotaQuali",
    encrypt: toBoolean(process.env.DB_ENCRYPT, true),
    trustServerCertificate: toBoolean(
      process.env.DB_TRUST_SERVER_CERTIFICATE,
      false,
    ),
    poolMin: toPort(process.env.DB_POOL_MIN, 0),
    poolMax: toPort(process.env.DB_POOL_MAX, 10),
    poolIdleTimeoutMs: toPort(process.env.DB_POOL_IDLE_TIMEOUT_MS, 30000),
  },
};

export default env;
