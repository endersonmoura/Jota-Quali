interface EnvConfig {
  port: number;
  nodeEnv: string;
  authSecret: string;
  authTokenTtlSeconds: number;
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
  nodeEnv: process.env.NODE_ENV ?? "development",
  authSecret: process.env.AUTH_SECRET ?? "jota-quali-dev-secret",
  authTokenTtlSeconds: toPort(process.env.AUTH_TOKEN_TTL_SECONDS, 28800)
};

export default env;
