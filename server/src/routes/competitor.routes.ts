import { Router } from "express";
import {
  createCompetitorController,
  deleteCompetitorController,
  getCompetitorByIDController,
  getCompetitorsController,
  updateCompetitorController,
} from "../controllers/competitor.controller";

const router = Router();

router.get("/", getCompetitorsController);
router.post("/", createCompetitorController);
router.get("/:id", getCompetitorByIDController);
router.patch("/:id", updateCompetitorController);
router.delete("/:id", deleteCompetitorController);

export default router;
