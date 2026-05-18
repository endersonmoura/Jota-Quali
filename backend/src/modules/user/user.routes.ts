import { Router } from "express";
import UserController from "./UserController";

const userRoutes = Router();
const userController = new UserController();

userRoutes.post("/users", userController.create);
userRoutes.post("/login", userController.login);

export default userRoutes;
