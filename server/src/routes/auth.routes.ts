import { Router } from "express";
import {
  signInController,
  signUpController,
  updateUserRoleController,
} from "../controllers/auth.controller";
import middleware from "../middleware";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/sign-up", signUpController);
router.post("/sign-in", signInController);
router.patch(
  "/role",
  middleware.auth.roleAuthenticationMiddleware([UserRole.ADMIN]),
  updateUserRoleController
);

export default router;
