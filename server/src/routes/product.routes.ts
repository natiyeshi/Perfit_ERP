import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getProductByIDController,
  getProductsController,
  updateProductController,
} from "../controllers/product.controller";

const router = Router();

router.get("/", getProductsController);
router.post("/", createProductController);
router.get("/:id", getProductByIDController);
router.patch("/:id", updateProductController);
router.delete("/:id", deleteProductController);

export default router;
