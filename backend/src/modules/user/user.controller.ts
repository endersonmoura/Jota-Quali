import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";

export class UserController {
  private service = new UserService();

  public listAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const users = await this.service.listUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  };

  public listPending = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const users = await this.service.listPendingUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  };

  public updateStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Em uma aplicação real, checaremos aqui se o token logado tem "role: ADMIN"
      await this.service.updateStatus(Number(req.params.id), req.body.status);
      res
        .status(200)
        .json({
          success: true,
          message: `Acesso definido como ${req.body.status}`,
        });
    } catch (error) {
      next(error);
    }
  };
}
