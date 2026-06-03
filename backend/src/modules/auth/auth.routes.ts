import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { registerSchema, loginSchema } from "./auth.schema";

const authRoutes = Router();
const controller = new AuthController();

authRoutes.post(
  "/register",
  validateRequest(registerSchema),
  controller.register,
);
authRoutes.post("/login", validateRequest(loginSchema), controller.login);

export default authRoutes;
