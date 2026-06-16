import { Router } from "express";
import { ObraController } from "./obra.controller";
import { ensureAuthenticated } from "../../middlewares/ensureAuthenticated";
import { ensureRole } from "../../middlewares/ensureRole";
import { validateRequest } from "../../middlewares/validateRequest";
import { createObraSchema, updateObraSchema } from "./obra.schema";

export const obraRoutes = Router();
const controller = new ObraController();

obraRoutes.use(ensureAuthenticated);

// GET /obras
obraRoutes.get("/", controller.listarObras);

// POST /obras
obraRoutes.post(
  "/",
  ensureRole(["Administrador", "Operacional"]),
  validateRequest(createObraSchema),
  controller.criarObra
);

// PATCH /obras/:id
obraRoutes.patch(
  "/:id",
  ensureRole(["Administrador", "Operacional"]),
  validateRequest(updateObraSchema),
  controller.atualizarObra
);
