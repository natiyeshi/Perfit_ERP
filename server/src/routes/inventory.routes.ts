import { Router } from "express";
import {
  createInventoryController,
  deleteInventoryController,
  getInventoryByIDController,
  getInventoriesController,
  updateInventoryController,
} from "../controllers/inventory.controller";

const router = Router();

router.get("/", getInventoriesController);
router.post("/", createInventoryController);
router.get("/:id", getInventoryByIDController);
router.patch("/:id", updateInventoryController);
router.delete("/:id", deleteInventoryController);

export default router;
