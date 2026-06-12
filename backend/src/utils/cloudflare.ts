import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import env from "../configs/env";
import * as crypto from "crypto";
import * as path from "path";

// A API do Cloudflare R2 é 100% compatível com a do S3.
const s3 = new S3Client({
  region: "auto",
  endpoint: env.cloudflareEndpoint, // Exemplo: https://<ACCOUNT_ID>.r2.cloudflarestorage.com
  credentials: {
    accessKeyId: env.cloudflareAccessKeyId,
    secretAccessKey: env.cloudflareSecretAccessKey,
  },
});

export const uploadBufferToR2 = async (
  buffer: Buffer,
  originalName: string,
  mimetype: string,
): Promise<string> => {
  const bucketName = env.cloudflareBucketName;
  
  // Geração de nome único para evitar conflitos no Bucket
  const fileHash = crypto.randomBytes(16).toString("hex");
  const ext = path.extname(originalName);
  const fileName = `documentos/${fileHash}${ext}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: buffer,
    ContentType: mimetype,
  });

  await s3.send(command);

  // A URL pública que o Cloudflare te fornece quando você configura um Domínio Público no Bucket.
  // Exemplo: https://pub-xxxxxxxxxxxxx.r2.dev
  return `${env.cloudflarePublicUrl}/${fileName}`;
};
