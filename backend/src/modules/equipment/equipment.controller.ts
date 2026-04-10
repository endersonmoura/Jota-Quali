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
      await this.service.createEquipment(req.body);
      res.status(201).json({ message: "Equipamento cadastrado com sucesso." });
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
      res.status(200).json(equipments);
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
      const equipment = await this.service.getEquipmentById(id);
      res.status(200).json(equipment);
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
      await this.service.updateEquipment(id, req.body);
      res.status(200).json({ message: "Equipamento atualizado com sucesso." });
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
      await this.service.deleteEquipment(id);
      res.status(200).json({ message: "Equipamento inativado com sucesso." });
    } catch (error) {
      next(error);
    }
  };
}
