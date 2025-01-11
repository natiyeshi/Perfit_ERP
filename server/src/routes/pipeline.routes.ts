import { Router } from "express";
import {
  createPipelineController,
  deletePipelineController,
  getPipelineByIDController,
  getPipelinesController,
  updatePipelineController,
} from "../controllers/pipeline.controller";

const router = Router();

router.get("/", getPipelinesController);
router.post("/", createPipelineController);
router.get("/:id", getPipelineByIDController);
router.patch("/:id", updatePipelineController);
router.delete("/:id", deletePipelineController);

export default router;
