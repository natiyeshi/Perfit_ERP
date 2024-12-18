import { Router } from "express";
import {
  createProductCategoryController,
  deleteProductCategoryController,
  getProductCategoryByIDController,
  getProductCategoriesController,
  updateProductCategoryController,
} from "../controllers/product-category.controller";

const router = Router();

router.get("/", getProductCategoriesController);
router.post("/", createProductCategoryController);
router.get("/:id", getProductCategoryByIDController);
router.patch("/:id", updateProductCategoryController);
router.delete("/:id", deleteProductCategoryController);

export default router;
