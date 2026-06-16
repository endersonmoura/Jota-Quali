import express from "express";
import cors from "cors";
import path from "path";
import { RequestContext } from "@mikro-orm/core";
import env from "./src/configs/env";
import { connectToDatabase, DI } from "./src/configs/db";
import { errorHandler, notFound } from "./src/middlewares/errorHandler";
import { initScheduler } from "./src/modules/notification/notification.scheduler";
import logger from "./src/utils/logger";

// Routes
import authRoutes from "./src/modules/auth/auth.routes";
import userRoutes from "./src/modules/user/user.routes";
import { equipmentRoutes } from "./src/modules/equipment/equipment.routes";
import auditRoutes from "./src/modules/audit/audit.routes";
import calibrationRoutes from "./src/modules/calibration/calibration.routes";
import documentRoutes from "./src/modules/document/document.routes";
import { referenceStandardRoutes } from "./src/modules/reference-standard/reference-standard.routes";
import { reportRoutes } from "./src/modules/report/report.routes";
import { obraRoutes } from "./src/modules/obra/obra.routes";
import notificationRoutes from "./src/modules/notification/notification.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// MikroORM Context
app.use((req, res, next) => {
  if (DI.orm && DI.orm.em) {
    RequestContext.create(DI.orm.em, next);
  } else {
    next();
  }
});

app.use("/auth", authRoutes);
app.use("/usuarios", userRoutes);
app.use("/equipamentos", equipmentRoutes);
app.use("/auditoria", auditRoutes);
app.use("/calibracoes", calibrationRoutes);
app.use("/documentos", documentRoutes);
app.use("/padroes-referencia", referenceStandardRoutes);
app.use("/relatorios", reportRoutes);
app.use("/obras", obraRoutes);
app.use("/notificacoes", notificationRoutes);

app.use(notFound);
app.use(errorHandler);

connectToDatabase()
  .then(async () => {
    try {
      await DI.em.getConnection().execute("IF COL_LENGTH('dbo.notificacao', 'lida') IS NULL ALTER TABLE dbo.notificacao ADD lida BIT DEFAULT 0 NOT NULL;");
    } catch (e: any) {
      console.log("Erro ao adicionar coluna 'lida' na notificacao:", e.message);
    }
    initScheduler();
    app.listen(env.port, () => {
      logger.info(`HTTP server running on port ${env.port}`);
      logger.info(`Environment: ${env.nodeEnv}`);
      logger.info(`Server Running...`);
    });
  })
  .catch((err) => logger.error("Falha ao iniciar o servidor", err));

export default app;
