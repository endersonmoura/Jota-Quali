import { Router } from "express";
import { DocumentController } from "./document.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { ensureAuthenticated } from "../../middlewares/ensureAuthenticated";
import { ensureRole } from "../../middlewares/ensureRole";
import {
  uploadLaudoSchema,
  assinarDocumentoSchema,
} from "./document.schema";

import multer from "multer";

const documentRoutes = Router();
const controller = new DocumentController();

// Configuração do multer (salva os arquivos na memória antes de mandar pro R2)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // limite de 5MB
});

// POST /api/documentos/upload-laudo
documentRoutes.post(
  "/upload-laudo",
  ensureAuthenticated,
  ensureRole(["administrador", "operacional"]),
  upload.single("arquivo"), // 'arquivo' é a chave que o Bruno enviará no form-data
  controller.uploadLaudo,
);

// POST /api/documentos/assinar
documentRoutes.post(
  "/assinar",
  ensureAuthenticated,
  ensureRole(["administrador"]), // RN08: Somente admin pode assinar
  validateRequest(assinarDocumentoSchema),
  controller.assinarDocumento,
);

export default documentRoutes;
