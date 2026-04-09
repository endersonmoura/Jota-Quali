import { NextFunction, Request, Response } from "express";
import { CreateUserDTO } from "../@types";
import CreateUserService from "../services/CreateUserService";

class UserController {
  private readonly createUserService = new CreateUserService();

  public create = async (
    req: Request<unknown, unknown, CreateUserDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await this.createUserService.execute(req.body);

      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
