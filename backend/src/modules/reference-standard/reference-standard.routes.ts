import { Router } from "express";
import { ReferenceStandardController } from "./reference-standard.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { ensureAuthenticated } from "../../middlewares/ensureAuthenticated";
import {
  createReferenceStandardSchema,
  updateReferenceStandardSchema,
} from "./reference-standard.schema";

const referenceStandardRoutes = Router();
const controller = new ReferenceStandardController();

// Todas as rotas de Padrões de Referência exigem autenticação
referenceStandardRoutes.use(ensureAuthenticated);

import { ensureRole } from "../../middlewares/ensureRole";

referenceStandardRoutes.post("/", ensureRole(["Administrador", "Calibrador"]), validateRequest(createReferenceStandardSchema), controller.create);
referenceStandardRoutes.get("/", controller.getAll);
referenceStandardRoutes.get("/:id", controller.getById);
referenceStandardRoutes.put("/:id", ensureRole(["Administrador", "Calibrador"]), validateRequest(updateReferenceStandardSchema), controller.update);
referenceStandardRoutes.delete("/:id", ensureRole(["Administrador", "Calibrador"]), controller.delete);

export { referenceStandardRoutes };
