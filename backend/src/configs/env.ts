import "dotenv/config";

interface EnvConfig {
  port: number;
  nodeEnv: string;
  authSecret: string;
  authTokenTtlSeconds: number;
  dbServer?: string;
  dbPort: number;
  dbUser?: string;
  dbHost?: string;
  dbPassword?: string;
  dbName?: string;
  cloudflareEndpoint: string;
  cloudflareAccessKeyId: string;
  cloudflareSecretAccessKey: string;
  cloudflareBucketName: string;
  cloudflarePublicUrl: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpFrom: string;
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
  authSecret: process.env.AUTH_SECRET || "minha_chave_super_secreta_aqui",
  authTokenTtlSeconds: Number(process.env.AUTH_TOKEN_TTL_SECONDS) || 86400,
  dbServer: process.env.DB_SERVER,
  dbPort: toPort(process.env.DB_PORT, 1433),
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbHost: process.env.DB_HOST,
  cloudflareEndpoint: process.env.CLOUDFLARE_ENDPOINT || "",
  cloudflareAccessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID || "",
  cloudflareSecretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY || "",
  cloudflareBucketName: process.env.CLOUDFLARE_BUCKET_NAME || "",
  cloudflarePublicUrl: process.env.CLOUDFLARE_PUBLIC_URL || "",
  smtpHost: process.env.SMTP_HOST || "smtp.mailtrap.io",
  smtpPort: toPort(process.env.SMTP_PORT, 2525),
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  smtpFrom: process.env.SMTP_FROM || "jotaquali@empresa.com",
};

export default env;
