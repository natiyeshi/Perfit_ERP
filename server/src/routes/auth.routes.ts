import { Router } from "express";
import {
  changePasswordController,
  signInController,
  signUpController,
  updateROLEController,
  verifyUser,
} from "../controllers/auth.controller";
import middleware from "../middleware";
import { USER_ROLE } from "@prisma/client";

const router = Router();

router.post("/sign-up", signUpController);
router.post("/sign-in", signInController);
router.patch(
  "/change-password",
  middleware.auth.authenticationMiddleWare,
  changePasswordController
);

router.get("/verify", middleware.auth.authenticationMiddleWare, verifyUser);

router.patch(
  "/role",
  middleware.auth.roleAuthenticationMiddleware([USER_ROLE.ADMIN]),
  updateROLEController
);

export default router;
