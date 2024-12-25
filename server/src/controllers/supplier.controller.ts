import { StatusCodes } from "http-status-codes";
import { asyncWrapper, RouteError, sendApiResponse } from "../utils";
import { queryValidator, supplierValidator } from "../validators";
import { db, zodErrorFmt } from "../libs";

// Get all suppliers
export const getSuppliersController = asyncWrapper(async (req, res) => {
  const paginationValiation =
    queryValidator.paginationsQueryValidator.safeParse(req.query);

  if (!paginationValiation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(paginationValiation.error)[0].message,
      zodErrorFmt(paginationValiation.error)
    );
  const suppliers = await db.supplier.findMany({
    include: {
      competitorImports: true,
      inventories: true,
    },
    take: paginationValiation.data.limit,
    skip: (paginationValiation.data.page || 1) - 1 || undefined,
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Suppliers retrieved successfully",
    result: suppliers,
  });
});

// Get supplier by ID
export const getSupplierByIdController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Supplier ID not provided or invalid.")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const supplier = await db.supplier.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
    include: {
      competitorImports: true,
      inventories: true,
    },
  });

  if (!supplier)
    throw RouteError.NotFound("Supplier not found with the provided ID.");

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Supplier retrieved successfully",
    result: supplier,
  });
});

export const createSupplierController = asyncWrapper(async (req, res) => {
  const bodyValidation = supplierValidator.createSupplierSchema.safeParse(
    req.body
  );

  if (!bodyValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );

  const supplier = await db.supplier.create({
    data: bodyValidation.data,
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Supplier created successfully",
    result: supplier,
  });
});

// Update supplier details
export const updateSupplierController = asyncWrapper(async (req, res) => {
  const bodyValidation = supplierValidator.updateSupplierSchema.safeParse(
    req.body
  );
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Supplier ID not provided or invalid.")
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

  const existingSupplier = await db.supplier.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  if (!existingSupplier)
    throw RouteError.NotFound("Supplier not found with the provided ID.");

  const updatedSupplier = await db.supplier.update({
    where: {
      id: queryParamValidation.data.id,
    },
    data: bodyValidation.data,
    include: {
      competitorImports: true,
      inventories: true,
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Supplier updated successfully",
    result: updatedSupplier,
  });
});

// Delete supplier
export const deleteSupplierController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Supplier ID not provided or invalid.")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const existingSupplier = await db.supplier.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  if (!existingSupplier)
    throw RouteError.NotFound("Supplier not found with the provided ID.");

  await db.supplier.delete({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Supplier deleted successfully",
    result: null,
  });
});
