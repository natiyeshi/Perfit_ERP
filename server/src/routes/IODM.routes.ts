import { Router } from "express";
import {
  createIODMController,
  deleteIODMController,
  getIODMByIDController,
  getIODMsController,
  // updateIODMController,
} from "../controllers/IODM.controller";

const router = Router();

router.get("/", getIODMsController);
router.post("/", createIODMController);
router.get("/:id", getIODMByIDController);
// router.patch("/:id", updateIODMController);
router.delete("/:id", deleteIODMController);

export default router;
