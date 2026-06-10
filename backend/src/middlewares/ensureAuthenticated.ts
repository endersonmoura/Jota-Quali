import { Request, Response, NextFunction } from "express";
import { createHmac } from "crypto";
import AppError from "../errors/AppError";
import env from "../configs/env";

export const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token JWT não informado", 401, "TOKEN_MISSING");
  }

  // DEBUG: Mostra no console o que o Bruno está enviando
  console.log("[Auth Debug] Header recebido:", authHeader);

  const [, token] = authHeader.split(" ");
  const parts = (token || "").split(".");

  if (parts.length !== 3) {
    throw new AppError(
      `Token mal formatado. Valor recebido: '${token}'`,
      401,
      "TOKEN_MALFORMED",
    );
  }

  const [header, body, signature] = parts;

  const validSignature = createHmac("sha256", env.authSecret || "secret")
    .update(`${header}.${body}`)
    .digest("base64url");

  if (signature !== validSignature) {
    throw new AppError("Token inválido ou adulterado", 401, "TOKEN_INVALID");
  }

  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8"));
  if (payload.exp && Date.now() >= payload.exp * 1000) {
    throw new AppError(
      "Sua sessão expirou. Faça login novamente.",
      401,
      "TOKEN_EXPIRED",
    );
  }

  // Injetamos o ID do usuário no escopo da resposta para os controllers usarem
  res.locals.user = { id: payload.sub };
  return next();
};
