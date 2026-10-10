import { Router } from "express";
import {
  deleteCompetitorImportController,
  getAverageUnitPriceController,
  getCompetitorImportByIDController,
  getCompetitorImportsController,
  getDashboardReportController,
  getImportAnalyticsController,
  getPipelineReportController,
} from "../controllers/competitor-import.controller";

const router = Router();

router.get("/", getCompetitorImportsController);
router.get("/analytics/average-unit-price", getAverageUnitPriceController);
router.get("/analytics/top", getImportAnalyticsController);
router.get("/analytics/dashboard-report", getDashboardReportController);
router.get("/analytics/pipeline-report", getPipelineReportController);
router.get("/:id", getCompetitorImportByIDController);
router.delete("/:id", deleteCompetitorImportController);

export default router;
