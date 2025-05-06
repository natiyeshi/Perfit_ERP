import { Router } from "express";
import {
  createCustomerController,
  createManyCustomersController,
  deleteCustomerController,
  getCustomerByIDController,
  getCustomersController,
  updateCustomerController,
} from "../controllers/customer.controller";

const router = Router();

router.get("/", getCustomersController);
router.post("/", createCustomerController);
router.post("/bulk", createManyCustomersController);
router.get("/:id", getCustomerByIDController);
router.patch("/:id", updateCustomerController);
router.delete("/:id", deleteCustomerController);

export default router;
