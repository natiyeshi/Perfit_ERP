import { Router } from "express";
import {
    createcostbuildupController,
    getcostbuildupByIDController,
    getcostbuildupsController,
    updatecostbuildupController,
} from "../controllers/CostBuildUp.controller";

const router = Router();

router.get("/", getcostbuildupsController);
router.post("/", createcostbuildupController);
router.get("/:id", getcostbuildupByIDController);
router.patch("/:id", updatecostbuildupController);

export default router;
