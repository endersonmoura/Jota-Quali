import "reflect-metadata";
import express from "express";
import env from "./src/configs/env";
import { errorHandler } from "./src/middlewares/errorHandler";
import { notFound } from "./src/middlewares/notFound";
import logger from "./src/utils/logger";
import { connectToDatabase } from "./src/configs/db";

import authRoutes from "./src/modules/auth";
import userRoutes from "./src/modules/user";
import equipmentRoutes from "./src/modules/equipment";
import { auditRoutes } from "./src/modules/audit";
import { calibrationRoutes } from "./src/modules/calibration";
import documentRoutes from "./src/modules/document/document.routes";
import { referenceStandardRoutes } from "./src/modules/reference-standard";
import { reportRoutes } from "./src/modules/report";
import { initScheduler } from "./src/modules/notification/notification.scheduler";

import { RequestContext } from "@mikro-orm/core";
import { DI } from "./src/configs/db";

const app = express();
app.use(express.json());

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

app.use(notFound);
app.use(errorHandler);

connectToDatabase()
  .then(() => {
    initScheduler();
    app.listen(env.port, () => {
      logger.info(`HTTP server running on port ${env.port}`);
      logger.info(`Environment: ${env.nodeEnv}`);
      logger.info(`Server Running...`);
    });
  })
  .catch((err) => logger.error("Falha ao iniciar o servidor", err));

export default app;
