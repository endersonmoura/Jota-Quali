import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import { UserRepository } from "../modules/user/user.repository";

export const ensureRole = (allowedRoles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const userId = res.locals.user?.id;

    if (!userId) {
      return next(new AppError("Usuário não autenticado", 401));
    }

    const repository = new UserRepository();
    const user = await repository.findById(userId);

    if (!user || !allowedRoles.includes(user.role)) {
      return next(
        new AppError(
          "Acesso negado: O seu perfil não possui permissão para esta ação.",
          403,
          "FORBIDDEN_ROLE",
        ),
      );
    }

    return next();
  };
};
