import { Router } from "express";
import {
  createCompetitorInventoryController,
  deleteCompetitorInventoryController,
  getCompetitorInventoryByIDController,
  getCompetitorInventoriesController,
  updateCompetitorInventoryController,
} from "../controllers/competitor-inventory.controller";

const router = Router();

router.get("/", getCompetitorInventoriesController);
router.post("/", createCompetitorInventoryController);
router.get("/:id", getCompetitorInventoryByIDController);
router.patch("/:id", updateCompetitorInventoryController);
router.delete("/:id", deleteCompetitorInventoryController);

export default router;
