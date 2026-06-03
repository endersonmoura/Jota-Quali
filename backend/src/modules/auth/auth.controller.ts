import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { CreateUserDTO, LoginDTO } from "./auth.dto";

export class AuthController {
  private service = new AuthService();

  public register = async (
    req: Request<unknown, unknown, CreateUserDTO>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = await this.service.register(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  public login = async (
    req: Request<unknown, unknown, LoginDTO>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const session = await this.service.login(req.body);
      res.status(200).json({ success: true, data: session });
    } catch (error) {
      next(error);
    }
  };
}
