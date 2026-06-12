import { Router } from "express";
import { ReportController } from "./report.controller";
import { ensureAuthenticated } from "../../middlewares/ensureAuthenticated";

const reportRoutes = Router();
const controller = new ReportController();

// Protegendo todas as rotas do dashboard/relatório
reportRoutes.use(ensureAuthenticated);

reportRoutes.get("/metrics", controller.getMetrics);
reportRoutes.get("/export/equipamentos", controller.exportEquipmentReport);

export { reportRoutes };
