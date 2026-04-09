import express from "express";
import env from "./src/configs/env";
import { errorHandler } from "./src/middlewares/errorHandler";
import { notFound } from "./src/middlewares/notFound";
import routes from "./src/routes";
import logger from "./src/utils/logger";

const app = express();

app.use(express.json());
app.use(routes);
app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => {
  logger.info(`HTTP server running on port ${env.port}`);
});

export default app;
