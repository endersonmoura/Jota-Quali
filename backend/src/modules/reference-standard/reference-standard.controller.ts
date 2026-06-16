import { Request, Response, NextFunction } from "express";
import { ReferenceStandardService } from "./reference-standard.service";

export class ReferenceStandardController {
  private service = new ReferenceStandardService();

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const padrao = await this.service.create(req.body);
      res.status(201).json({ success: true, data: padrao });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const padroes = await this.service.getAll();
      res.status(200).json({ success: true, data: padroes });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const padrao = await this.service.getById(Number(id));
      res.status(200).json({ success: true, data: padrao });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const padrao = await this.service.update(Number(id), req.body);
      res.status(200).json({ success: true, data: padrao });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.service.delete(Number(id));
      res.status(200).json({ success: true, message: "Padrão de referência inativado com sucesso." });
    } catch (error) {
      next(error);
    }
  };
}
