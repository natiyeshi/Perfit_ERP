import { StatusCodes } from "http-status-codes";
import { asyncWrapper, RouteError, sendApiResponse } from "../utils";
import { productValidator } from "../validators";
import { db, zodErrorFmt } from "../libs";

export const getProductsController = asyncWrapper(async (req, res) => {
  const products = await db.product.findMany({});

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Products retrived successfully",
    result: products,
  });
});

export const getProductByIDController = asyncWrapper(async (req, res) => {
  const queryParamValidation = productValidator.getProductByIdSchema.safeParse(
    req.params
  );

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
  const { data, success, error } =
    productValidator.createProductSchema.safeParse(req.body);

  if (!success)
    throw RouteError.BadRequest(
      zodErrorFmt(error)[0].message,
      zodErrorFmt(error)
    );

  const product = await db.product.create({
    data,
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Product created successfully",
    result: product,
  });
});

export const updateProductController = asyncWrapper(async (req, res) => {
  const bodyValidation = productValidator.updateProductSchema.safeParse(
    req.body
  );

  const queryParamValidation = productValidator.getProductByIdSchema.safeParse(
    req.params
  );

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
  const queryParamValidation = productValidator.getProductByIdSchema.safeParse(
    req.params
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
