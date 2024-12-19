import { Router } from "express";
import {
  createTransactionController,
  deleteTransactionController,
  getTransactionByIDController,
  getTransactionsController,
  updateTransactionController,
} from "../controllers/transaction.controller";

const router = Router();

router.get("/", getTransactionsController);
router.post("/", createTransactionController);
router.get("/:id", getTransactionByIDController);
router.patch("/:id", updateTransactionController);
router.delete("/:id", deleteTransactionController);

export default router;
