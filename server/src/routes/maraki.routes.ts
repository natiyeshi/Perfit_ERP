import { Router } from "express";
import {
  getDashboardInfo,
  // updateIODMController,
} from "../controllers/maraki.controller";

const router = Router();

router.get("/dashboard", getDashboardInfo);

export default router;
