import { Router } from "express";
import { NotificationController } from "./notification.controller";
import { ensureAuthenticated } from "../../middlewares/ensureAuthenticated";

const router = Router();
const controller = new NotificationController();

router.use(ensureAuthenticated);

router.get("/", controller.getMyNotifications);
router.patch("/:id/read", controller.markAsRead);
router.patch("/read-all", controller.markAllAsRead);

export default router;
