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

referenceStandardRoutes.post("/", validateRequest(createReferenceStandardSchema), controller.create);
referenceStandardRoutes.get("/", controller.getAll);
referenceStandardRoutes.get("/:id", controller.getById);
referenceStandardRoutes.put("/:id", validateRequest(updateReferenceStandardSchema), controller.update);
referenceStandardRoutes.delete("/:id", controller.delete);

export { referenceStandardRoutes };
