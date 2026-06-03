import { Router } from "express";
import { AuditController } from "./audit.controller";

const auditRoutes = Router();
const controller = new AuditController();

// GET /api/auditoria?resourceId={id}
auditRoutes.get("/", controller.getLogs);

export default auditRoutes;
