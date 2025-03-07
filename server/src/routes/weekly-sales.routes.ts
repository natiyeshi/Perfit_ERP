import { Router } from "express";
import {
  createWeeklySaleController,
  deleteWeeklySaleController,
  getWeeklySaleByIDController,
  getWeeklySalesController,
  updateWeeklySaleController,
  getThisWeakSalesController,
  getAllWeeklySalesController,
  getWeeklySaleBySalesIdController
} from "../controllers/weekly-sales.controller";

import middleware from "../middleware";
import { USER_ROLE } from "@prisma/client";

const router = Router();

router.get("/all", 
  middleware.auth.roleAuthenticationMiddleware([USER_ROLE.ADMIN]),
  getAllWeeklySalesController
);
router.get("/", getWeeklySalesController);
router.get("/thisweek", getThisWeakSalesController);
router.post("/", createWeeklySaleController);
router.get("/:id", getWeeklySaleByIDController);
router.get("/salesperson/:id", getWeeklySaleBySalesIdController);
router.patch("/:id", updateWeeklySaleController);
router.delete("/:id", deleteWeeklySaleController);

export default router;
