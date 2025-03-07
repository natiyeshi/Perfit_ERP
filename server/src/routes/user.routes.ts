import { Router } from "express";

import middleware from "../middleware";
import { USER_ROLE } from "@prisma/client";
import {
  getUserByIdController,
  getUsersController,
  updateFlagsByUserIdController,
  updateProfileController,
} from "../controllers/user.controller";

const router = Router();

router.get(
  "/",
  middleware.auth.roleAuthenticationMiddleware([USER_ROLE.ADMIN]),
  getUsersController
);
router.get(
  "/:id",
  middleware.auth.roleAuthenticationMiddleware([USER_ROLE.ADMIN]),
  getUserByIdController
);
router.patch(
  "/",
  middleware.auth.authenticationMiddleWare,
  updateProfileController
);
router.patch(
  "/flags/:id",
  middleware.auth.roleAuthenticationMiddleware([USER_ROLE.ADMIN]),
  updateFlagsByUserIdController
);

export default router;
