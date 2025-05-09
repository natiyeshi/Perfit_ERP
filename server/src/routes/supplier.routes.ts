import { Router } from "express";
import {
  getSupplierByIdController,
  deleteSupplierController,
  getSuppliersController,
  updateSupplierController,
  createSupplierController,
  createMultipleSuppliersController,
} from "../controllers/supplier.controller";

const router = Router();

router.get("/", getSuppliersController);
router.post("/", createSupplierController);
router.post("/bulk", createMultipleSuppliersController);
router.get("/:id", getSupplierByIdController);
router.patch("/:id", updateSupplierController);
router.delete("/:id", deleteSupplierController);

export default router;
