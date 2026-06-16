import { Request, Response, NextFunction } from "express";
import { PadraoService } from "./padrao.service";

export class PadraoController {
  private service = new PadraoService();

  public listAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const padroes = await this.service.listPadroes();
      res.json({ success: true, data: padroes });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const padrao = await this.service.getPadrao(Number(req.params.id));
      res.json({ success: true, data: padrao });
    } catch (error) {
      next(error);
    }
  };

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const padrao = await this.service.createPadrao(req.body);
      res.status(201).json({ success: true, data: padrao });
    } catch (error) {
      next(error);
    }
  };

  public update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const padrao = await this.service.updatePadrao(Number(req.params.id), req.body);
      res.json({ success: true, data: padrao });
    } catch (error) {
      next(error);
    }
  };

  public inativar = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.service.inativarPadrao(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
