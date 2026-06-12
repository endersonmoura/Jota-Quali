import { Router } from "express";
import { equipmentRoutes } from "./equipment.routes";

const routes = Router();

routes.use("/", equipmentRoutes);

export default routes;
