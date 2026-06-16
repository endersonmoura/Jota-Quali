import { NextFunction, Request, Response } from "express";
import { EquipmentService } from "./equipment.service";

export class EquipmentController {
  private service = new EquipmentService();

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const novoEquipamento = await this.service.createEquipment(req.body);
      res.status(201).json({ success: true, data: novoEquipamento, message: "Equipamento cadastrado com sucesso." });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const equipments = await this.service.getAllEquipments();
      res.status(200).json({ success: true, data: equipments });
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const equipment = await this.service.getEquipmentById(Number(id));
      res.status(200).json({ success: true, data: equipment });
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const equipamento = await this.service.updateEquipment(Number(id), req.body);
      res.status(200).json({ success: true, data: equipamento, message: "Equipamento atualizado com sucesso." });
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      await this.service.deleteEquipment(Number(id));
      res.status(200).json({ success: true, message: "Equipamento inativado com sucesso." });
    } catch (error) {
      next(error);
    }
  };
}
