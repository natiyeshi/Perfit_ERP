import { Router } from "express";

import middleware from "../middleware";
import { UserRole } from "@prisma/client";
import {
  getUserByIdController,
  getUsersController,
  updateFlagsByUserIdController,
  updateProfileController,
} from "../controllers/user.controller";

const router = Router();

router.get(
  "",
  middleware.auth.roleAuthenticationMiddleware([UserRole.ADMIN]),
  getUsersController
);
router.get(
  "/id:",
  middleware.auth.roleAuthenticationMiddleware([UserRole.ADMIN]),
  getUserByIdController
);
router.patch(
  "/",
  middleware.auth.authenticationMiddleWare,
  updateProfileController
);
router.patch(
  "/flags/:id",
  middleware.auth.roleAuthenticationMiddleware([UserRole.ADMIN]),
  updateFlagsByUserIdController
);

export default router;
