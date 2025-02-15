import { Router } from "express";
import {
  createWeeklySaleController,
  deleteWeeklySaleController,
  getWeeklySaleByIDController,
  getWeeklySalesController,
  updateWeeklySaleController,
} from "../controllers/weekly-sales.controller";

const router = Router();

router.get("/", getWeeklySalesController);
router.post("/", createWeeklySaleController);
router.get("/:id", getWeeklySaleByIDController);
router.patch("/:id", updateWeeklySaleController);
router.delete("/:id", deleteWeeklySaleController);

export default router;
