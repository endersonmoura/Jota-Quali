import { Router } from "express";
import { EquipmentController } from "./equipment.controller";
import { ensureAuthenticated } from "../../middlewares/ensureAuthenticated";
import { ensureRole } from "../../middlewares/ensureRole";

const equipmentRoutes = Router();
const equipmentController = new EquipmentController();

equipmentRoutes.use(ensureAuthenticated);

// Apenas Administrador e Calibrador podem criar/editar/inativar
equipmentRoutes.post("/", ensureRole(["Administrador", "Calibrador"]), equipmentController.create);
equipmentRoutes.get("/", equipmentController.getAll);
equipmentRoutes.get("/:id", equipmentController.getById);
equipmentRoutes.put("/:id", ensureRole(["Administrador", "Calibrador"]), equipmentController.update);
equipmentRoutes.patch("/:id/inativar", ensureRole(["Administrador", "Calibrador"]), equipmentController.delete);

export { equipmentRoutes };
