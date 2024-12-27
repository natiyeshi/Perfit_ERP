import { Router } from "express";
import {
  createImportController,
  deleteImportController,
  getImportByIDController,
  getImportsController,
  updateImportController,
} from "../controllers/import.controller";

const router = Router();

router.get("/", getImportsController);
router.post("/", createImportController);
router.get("/:id", getImportByIDController);
router.patch("/:id", updateImportController);
router.delete("/:id", deleteImportController);

export default router;
