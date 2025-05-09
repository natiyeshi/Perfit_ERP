import { Router } from "express";
import {
  getCompetitorByIDController,
  deleteCompetitorController,
  getCompetitorsController,
  updateCompetitorController,
  createCompetitorController,
  createMultipleCompetitorsController,
} from "../controllers/competitor.controller";

const router = Router();

router.get("/", getCompetitorsController);
router.post("/", createCompetitorController);
router.post("/bulk", createMultipleCompetitorsController);
router.get("/:id", getCompetitorByIDController);
router.patch("/:id", updateCompetitorController);
router.delete("/:id", deleteCompetitorController);

export default router;
