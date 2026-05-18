import { NextFunction, Request, Response } from "express";
import { CreateUserDTO, LoginDTO } from "../../@types";
import AuthenticateUserService from "./AuthenticateUserService";
import CreateUserService from "./CreateUserService";

class UserController {
  private readonly createUserService = new CreateUserService();
  private readonly authenticateUserService = new AuthenticateUserService();

  public create = async (
    req: Request<unknown, unknown, CreateUserDTO>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = await this.createUserService.execute(req.body);

      res.status(201).json({
        success: true,
        data: user,
      });
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
      const session = await this.authenticateUserService.execute(req.body);

      res.status(200).json({
        success: true,
        data: session,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
