import { Router } from "express";
import {
  deleteCompetitorImportController,
  getCompetitorImportByIDController,
  getCompetitorImportsController,
} from "../controllers/competitor-import.controller";

const router = Router();

router.get("/", getCompetitorImportsController);
router.get("/:id", getCompetitorImportByIDController);
router.delete("/:id", deleteCompetitorImportController);

export default router;
