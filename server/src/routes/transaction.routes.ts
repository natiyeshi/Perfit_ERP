import { Router } from "express";
import {
  createTransactionController,
  deleteTransactionController,
  getTransactionByIDController,
  getTransactionsController,
  updateTransactionController,
} from "../controllers/transaction.controller";
import middleware from "../middleware";
import { ROLE } from "@prisma/client";

const router = Router();

router.get("/", getTransactionsController);
router.post(
  "/",
  middleware.auth.roleAuthenticationMiddleware([ROLE.ADMIN, ROLE.SALES_PERSON]),
  createTransactionController
);
router.get("/:id", getTransactionByIDController);
router.patch("/:id", updateTransactionController);
router.delete("/:id", deleteTransactionController);

export default router;
