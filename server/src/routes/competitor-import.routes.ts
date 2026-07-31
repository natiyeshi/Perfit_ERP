import { Router } from "express";
import {
  deleteCompetitorImportController,
  getAverageUnitPriceController,
  getCompetitorImportByIDController,
  getCompetitorImportsController,
} from "../controllers/competitor-import.controller";

const router = Router();

router.get("/", getCompetitorImportsController);
router.get("/analytics/average-unit-price", getAverageUnitPriceController);
router.get("/:id", getCompetitorImportByIDController);
router.delete("/:id", deleteCompetitorImportController);

export default router;
