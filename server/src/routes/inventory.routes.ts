import { Router } from "express";
import {
  deleteInventoryController,
  getInventoryByIDController,
  getInventoriesController,
  updateInventoryController,
} from "../controllers/inventory.controller";

const router = Router();

router.get("/", getInventoriesController);
router.get("/:id", getInventoryByIDController);
router.patch("/:id", updateInventoryController);
router.delete("/:id", deleteInventoryController);

export default router;
