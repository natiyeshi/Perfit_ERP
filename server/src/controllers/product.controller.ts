import { StatusCodes } from "http-status-codes";
import { asyncWrapper, RouteError, sendApiResponse } from "../utils";
import { productValidator, queryValidator } from "../validators";
import { db, zodErrorFmt } from "../libs";

export const getProductsController = asyncWrapper(async (req, res) => {
  const paginationValiation =
    queryValidator.paginationsQueryValidator.safeParse(req.query);

  if (!paginationValiation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(paginationValiation.error)[0].message,
      zodErrorFmt(paginationValiation.error)
    );

  const products = await db.product.findMany({
    take: paginationValiation.data.limit,
    skip: (paginationValiation.data.page || 1) - 1 || undefined,
    orderBy: {
      name: 'asc', // Change 'name' to your desired sort field if needed
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Products retrived successfully",
    result: products,
  });
});

export const getProductByIDController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Product ID isn't provided or isn't valid")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const product = await db.product.findUnique({
    where: { id: queryParamValidation.data.id },
  });

  if (!product)
    throw RouteError.NotFound("Product not found with the provide ID.");

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product retrived successfully",
    result: product,
  });
});

export const createProductController = asyncWrapper(async (req, res) => {
  // Validator expects array of products
  const bodyValidation = productValidator.createProductsArraySchema.safeParse(
    req.body
  );

  if (!bodyValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );

  const products = await db.product.createMany({
    data: bodyValidation.data,
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.CREATED,
    success: true,
    message: `${
      products.count > 1 ? "Products" : "Product"
    } created successfully`,
    result: products,
  });
});

export const updateProductController = asyncWrapper(async (req, res) => {
  const bodyValidation = productValidator.updateProductSchema.safeParse(
    req.body
  );

  const queryParamValidation = queryValidator
    .queryParamIDValidator("Product ID isn't provided or isn't valid")
    .safeParse(req.params);

  if (!bodyValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const existingProduct = await db.product.findUnique({
    where: { id: queryParamValidation.data.id },
  });

  if (!existingProduct)
    throw RouteError.NotFound("Product not found with the provide ID.");

  const updatedProduct = await db.product.update({
    where: {
      id: queryParamValidation.data.id,
    },
    data: { ...existingProduct, ...bodyValidation.data },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product updated successfully",
    result: updatedProduct,
  });
});

export const deleteProductController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Product ID isn't provided or isn't valid")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const existingProduct = await db.product.findUnique({
    where: { id: queryParamValidation.data.id },
  });

  if (!existingProduct)
    throw RouteError.NotFound("Product not found with the provide ID.");

  const deletedProduct = await db.product.delete({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product deleted successfully",
    result: deletedProduct,
  });
});
