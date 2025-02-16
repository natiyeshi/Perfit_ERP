import { Router } from "express";
import {
  createTransactionController,
  deleteTransactionController,
  getTransactionByIDController,
  getTransactionsController,
  updateTransactionController,
} from "../controllers/transaction.controller";
import middleware from "../middleware";
import { USER_ROLE } from "@prisma/client";

const router = Router();

router.get("/", getTransactionsController);
router.post(
  "/",
  middleware.auth.roleAuthenticationMiddleware([USER_ROLE.ADMIN, USER_ROLE.SALES_PERSON]),
  createTransactionController
);
router.get("/:id", getTransactionByIDController);
router.patch("/:id", updateTransactionController);
router.delete("/:id", deleteTransactionController);

export default router;
