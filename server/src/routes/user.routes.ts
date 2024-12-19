import { Router } from "express";

import middleware from "../middleware";
import { ROLE } from "@prisma/client";
import {
  getUserByIdController,
  getUsersController,
  updateFlagsByUserIdController,
  updateProfileController,
} from "../controllers/user.controller";

const router = Router();

router.get(
  "",
  middleware.auth.roleAuthenticationMiddleware([ROLE.ADMIN]),
  getUsersController
);
router.get(
  "/id:",
  middleware.auth.roleAuthenticationMiddleware([ROLE.ADMIN]),
  getUserByIdController
);
router.patch(
  "/",
  middleware.auth.authenticationMiddleWare,
  updateProfileController
);
router.patch(
  "/flags/:id",
  middleware.auth.roleAuthenticationMiddleware([ROLE.ADMIN]),
  updateFlagsByUserIdController
);

export default router;
