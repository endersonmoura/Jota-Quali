import express from "express";
import env from "./src/configs/env";
import { closeDatabase, connectDatabase } from "./src/database/connection";
import { errorHandler } from "./src/middlewares/errorHandler";
import { notFound } from "./src/middlewares/notFound";
import routes from "./src/modules/user";
import logger from "./src/utils/logger";

const app = express();

app.use(express.json());
app.use(routes);
app.use(notFound);
app.use(errorHandler);

async function shutdown(signal: string): Promise<void> {
  logger.warn(`Shutting down HTTP server (${signal})`);

  try {
    await closeDatabase();
    logger.info("Database connection closed");
  } catch (error) {
    logger.error("Error while closing database connection", error);
  } finally {
    process.exit(0);
  }
}

async function bootstrap(): Promise<void> {
  await connectDatabase();

  app.listen(env.port, () => {
    logger.info(`HTTP server running on port ${env.port}`);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

void bootstrap().catch((error) => {
  logger.error("Failed to start application", error);
  process.exit(1);
});

export default app;
