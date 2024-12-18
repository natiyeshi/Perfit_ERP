import { StatusCodes } from "http-status-codes";
import { asyncWrapper, RouteError, sendApiResponse } from "../utils";
import { db, zodErrorFmt } from "../libs";
import { productCategoryValidator, queryParamIDValidator } from "../validators";

// Get all product categories
export const getProductCategoriesController = asyncWrapper(async (req, res) => {
  const productCategories = await db.productCategory.findMany({
    include: {
      products: true, // Include products associated with each category
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product categories retrieved successfully.",
    result: productCategories,
  });
});

// Get a product category by ID
export const getProductCategoryByIDController = asyncWrapper(
  async (req, res) => {
    const queryParamValidation = queryParamIDValidator().safeParse(req.params);

    if (!queryParamValidation.success)
      throw RouteError.BadRequest(
        zodErrorFmt(queryParamValidation.error)[0].message,
        zodErrorFmt(queryParamValidation.error)
      );

    const productCategory = await db.productCategory.findUnique({
      where: {
        id: queryParamValidation.data.id,
      },
      include: {
        products: true, // Include products associated with the category
      },
    });

    if (!productCategory)
      throw RouteError.NotFound(
        "Product category not found with the provided ID."
      );

    return sendApiResponse({
      res,
      statusCode: StatusCodes.OK,
      success: true,
      message: "Product category retrieved successfully.",
      result: productCategory,
    });
  }
);

// Create a new product category
export const createProductCategoryController = asyncWrapper(
  async (req, res) => {
    const bodyValidation =
      productCategoryValidator.createProductCategorySchema.safeParse(req.body);

    if (!bodyValidation.success)
      throw RouteError.BadRequest(
        zodErrorFmt(bodyValidation.error)[0].message,
        zodErrorFmt(bodyValidation.error)
      );

    const newProductCategory = await db.productCategory.create({
      data: bodyValidation.data,
    });

    return sendApiResponse({
      res,
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Product category created successfully.",
      result: newProductCategory,
    });
  }
);

// Update a product category
export const updateProductCategoryController = asyncWrapper(
  async (req, res) => {
    const queryParamValidation = queryParamIDValidator().safeParse(req.params);
    const bodyValidation =
      productCategoryValidator.updateProductCategorySchema.safeParse(req.body);

    if (!queryParamValidation.success)
      throw RouteError.BadRequest(
        zodErrorFmt(queryParamValidation.error)[0].message,
        zodErrorFmt(queryParamValidation.error)
      );

    if (!bodyValidation.success)
      throw RouteError.BadRequest(
        zodErrorFmt(bodyValidation.error)[0].message,
        zodErrorFmt(bodyValidation.error)
      );

    const existingProductCategory = await db.productCategory.findUnique({
      where: {
        id: queryParamValidation.data.id,
      },
      include: {
        products: true,
      },
    });

    if (!existingProductCategory)
      throw RouteError.NotFound(
        "Product category not found with the provided ID."
      );

    const updatedProductCategory = await db.productCategory.update({
      where: {
        id: queryParamValidation.data.id,
      },
      data: bodyValidation.data,
    });

    return sendApiResponse({
      res,
      statusCode: StatusCodes.OK,
      success: true,
      message: "Product category updated successfully.",
      result: updatedProductCategory,
    });
  }
);

// Delete a product category
export const deleteProductCategoryController = asyncWrapper(
  async (req, res) => {
    const queryParamValidation = queryParamIDValidator().safeParse(req.params);

    if (!queryParamValidation.success)
      throw RouteError.BadRequest(
        zodErrorFmt(queryParamValidation.error)[0].message,
        zodErrorFmt(queryParamValidation.error)
      );

    const existingProductCategory = await db.productCategory.findUnique({
      where: {
        id: queryParamValidation.data.id,
      },
      include: {
        products: true,
      },
    });

    if (!existingProductCategory)
      throw RouteError.NotFound(
        "Product category not found with the provided ID."
      );

    await db.productCategory.delete({
      where: {
        id: queryParamValidation.data.id,
      },
    });

    return sendApiResponse({
      res,
      statusCode: StatusCodes.OK,
      success: true,
      message: "Product category deleted successfully.",
      result: null,
    });
  }
);
