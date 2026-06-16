import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateStatusSchema } from "./user.schema";
import { ensureAuthenticated } from "../../middlewares/ensureAuthenticated";
import { ensureRole } from "../../middlewares/ensureRole";

const userRoutes = Router();
const userController = new UserController();

// Aplica a exigência de Token para TODAS as rotas de usuários
userRoutes.use(ensureAuthenticated);

userRoutes.get("/", ensureRole(["Administrador"]), userController.listAll);
userRoutes.get(
  "/pending",
  ensureRole(["Administrador"]),
  userController.listPending,
);
userRoutes.patch(
  "/:id/status",
  ensureRole(["Administrador"]),
  validateRequest(updateStatusSchema),
  userController.updateStatus,
);

userRoutes.patch(
  "/:id/role",
  ensureRole(["Administrador"]),
  userController.updateRole,
);

userRoutes.patch(
  "/:id/profile",
  userController.updateProfile,
);

export default userRoutes;
