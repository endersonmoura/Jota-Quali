import { Router } from "express";
import { AuditController } from "./audit.controller";

import { ensureAuthenticated } from "../../middlewares/ensureAuthenticated";

const auditRoutes = Router();
const controller = new AuditController();

// GET /auditoria?resourceId={id}
auditRoutes.get("/", ensureAuthenticated, controller.getLogs);

export default auditRoutes;
