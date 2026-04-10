import { Router } from "express";
import { EquipmentController } from "./equipment.controller";

const equipmentRoutes = Router();
const equipmentController = new EquipmentController();

equipmentRoutes.post("/", equipmentController.create);
equipmentRoutes.get("/", equipmentController.getAll);
equipmentRoutes.get("/:id", equipmentController.getById);
equipmentRoutes.put("/:id", equipmentController.update);
equipmentRoutes.delete("/:id", equipmentController.delete);

export { equipmentRoutes };
