import { Router } from "express";
import {
  signInController,
  signUpController,
  updateROLEController,
} from "../controllers/auth.controller";
import middleware from "../middleware";
import { ROLE } from "@prisma/client";

const router = Router();

router.post("/sign-up", signUpController);
router.post("/sign-in", signInController);
router.patch(
  "/role",
  middleware.auth.roleAuthenticationMiddleware([ROLE.ADMIN]),
  updateROLEController
);

export default router;
