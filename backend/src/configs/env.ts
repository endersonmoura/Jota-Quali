interface EnvConfig {
  port: number;
  nodeEnv: string;
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
  nodeEnv: process.env.NODE_ENV ?? "development"
};

export default env;
