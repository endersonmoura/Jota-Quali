import { Router } from "express";
import { PadraoController } from "./padrao.controller";
import { ensureAuthenticated } from "../../middlewares/ensureAuthenticated";
import { ensureRole } from "../../middlewares/ensureRole";

const padraoRoutes = Router();
const padraoController = new PadraoController();

padraoRoutes.use(ensureAuthenticated);

// Listagem aberta a todos os usuários autenticados
padraoRoutes.get("/", padraoController.listAll);
padraoRoutes.get("/:id", padraoController.getById);

// Apenas Administrador e Calibrador podem criar/editar/inativar
padraoRoutes.post("/", ensureRole(["Administrador", "Calibrador"]), padraoController.create);
padraoRoutes.put("/:id", ensureRole(["Administrador", "Calibrador"]), padraoController.update);
padraoRoutes.patch("/:id/inativar", ensureRole(["Administrador", "Calibrador"]), padraoController.inativar);

export { padraoRoutes };
