import { Router } from "express";
import {
  createCompetitorImportController,
  deleteCompetitorImportController,
  getCompetitorImportByIDController,
  getCompetitorImportsController,
  updateCompetitorImportController,
} from "../controllers/competitor-import.controller";

const router = Router();

router.get("/", getCompetitorImportsController);
router.post("/", createCompetitorImportController);
router.get("/:id", getCompetitorImportByIDController);
router.patch("/:id", updateCompetitorImportController);
router.delete("/:id", deleteCompetitorImportController);

export default router;
