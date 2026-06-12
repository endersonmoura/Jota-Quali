import { Router } from "express";
import { CalibrationController } from "./calibration.controller";
import { validateRequest } from "../../middlewares/validateRequest"; // Exemplo de import do seu middleware de validação
import {
  solicitarCalibracaoSchema,
  registrarCalibracaoInternaSchema,
} from "./calibration.schema";

import { ensureAuthenticated } from "../../middlewares/ensureAuthenticated";

const calibrationRoutes = Router();
const controller = new CalibrationController();

// POST /api/calibracoes/solicitacoes
calibrationRoutes.post(
  "/solicitacoes",
  ensureAuthenticated,
  validateRequest(solicitarCalibracaoSchema), // <-- Ative quando tiver o middleware Zod
  controller.solicitarCalibracao,
);

// POST /api/calibracoes/interna
calibrationRoutes.post(
  "/interna",
  ensureAuthenticated,
  validateRequest(registrarCalibracaoInternaSchema), // <-- Ative quando tiver o middleware Zod
  controller.registrarCalibracaoInterna,
);

export default calibrationRoutes;
