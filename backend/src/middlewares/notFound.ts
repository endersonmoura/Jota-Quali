import { RequestHandler } from "express";
import AppError from "../errors/AppError";

export const notFound: RequestHandler = (req, _res, next) => {
  next(
    new AppError(
      `route ${req.method} ${req.originalUrl} not found`,
      404,
      "ROUTE_NOT_FOUND"
    )
  );
};
