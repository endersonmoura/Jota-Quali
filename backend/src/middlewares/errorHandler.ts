import { ErrorRequestHandler } from "express";
import env from "../configs/env";
import AppError from "../errors/AppError";
import logger from "../utils/logger";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    });
    return;
  }

  logger.error("Unhandled error", {
    message: error instanceof Error ? error.message : "Unknown error",
    stack: error instanceof Error ? error.stack : undefined
  });

  const isProduction = env.nodeEnv === "production";

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: isProduction ? "Internal server error" : "Unhandled internal error",
      details: isProduction ? undefined : error
    }
  });
};
