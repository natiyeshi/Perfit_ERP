import { Router } from "express";
import { getSalesPersonsDataController } from "../controllers/sales.controller";


const router = Router();

router.get("/", getSalesPersonsDataController);

export default router;
