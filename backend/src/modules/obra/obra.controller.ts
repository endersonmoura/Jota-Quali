import { Request, Response, NextFunction } from "express";
import { ObraService } from "./obra.service";

export class ObraController {
  private service = new ObraService();

  public listarObras = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const status = req.query.status as string;
      const obras = await this.service.listarObras(status);
      res.status(200).json({ success: true, data: obras });
    } catch (error) {
      next(error);
    }
  };

  public criarObra = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // O usuário autenticado está em req.user.id
      const criadoPorId = (req as any).user?.id ? Number((req as any).user.id) : undefined;
      const obra = await this.service.criarObra({ ...req.body, criadoPorId });
      res.status(201).json({ success: true, data: obra });
    } catch (error) {
      next(error);
    }
  };

  public atualizarObra = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const obra = await this.service.atualizarObra(Number(req.params.id), req.body);
      res.status(200).json({ success: true, data: obra });
    } catch (error) {
      next(error);
    }
  };
}
