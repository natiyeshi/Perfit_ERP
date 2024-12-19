import { Router } from "express";
import {
  createCustomerController,
  deleteCustomerController,
  getCustomerByIDController,
  getCustomersController,
  updateCustomerController,
} from "../controllers/customer.controller";

const router = Router();

router.get("/", getCustomersController);
router.post("/", createCustomerController);
router.get("/:id", getCustomerByIDController);
router.patch("/:id", updateCustomerController);
router.delete("/:id", deleteCustomerController);

export default router;
