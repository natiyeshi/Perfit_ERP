import { StatusCodes } from "http-status-codes";
import {
  asyncWrapper,
  filterByLastDays,
  RouteError,
  sendApiResponse,
} from "../utils";
import { db, zodErrorFmt } from "../libs";
import { importValidator, queryValidator } from "../validators";

export const getImportsController = asyncWrapper(async (req, res) => {
  const queryValidation = importValidator.getImportsQuerySchema.safeParse(
    req.query
  );

  if (!queryValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryValidation.error)[0].message,
      zodErrorFmt(queryValidation.error)
    );

  const isPopulate = queryValidation.data.populate === "true";

  let imports = await db.import.findMany({
    take: queryValidation.data.limit,
    skip: (queryValidation.data.page || 1) - 1 || undefined,
    include: {
      product: isPopulate,
      supplier: isPopulate,
    },
  });

  if (queryValidation.success && queryValidation.data.days)
    imports = filterByLastDays<(typeof imports)[0]>(
      imports,
      queryValidation.data.days
    );

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Imports retrieved successfully.",
    result: imports,
  });
});

export const getImportByIDController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Import ID not provided or invalid.")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const existingImport = await db.import.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
    include: {
      product: true,
      supplier: true,
    },
  });

  if (!existingImport)
    throw RouteError.NotFound("Import not found with the provided ID.");

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Import retrieved successfully.",
    result: existingImport,
  });
});

export const createImportController = asyncWrapper(async (req, res) => {
  const bodyValidation = importValidator.createImportSchema.safeParse(req.body);

  if (!bodyValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );

  const existingSupplier = await db.supplier.findUnique({
    where: {
      id: bodyValidation.data.supplierId,
    },
  });

  if (!existingSupplier)
    throw RouteError.NotFound(
      "Supplier not found with the provided supplier ID."
    );

  const existingProduct = await db.product.findUnique({
    where: {
      id: bodyValidation.data.productId,
    },
  });

  if (!existingProduct)
    throw RouteError.NotFound(
      "Product not found with the provided product ID."
    );

  const newImport = await db.import.create({
    data: bodyValidation.data,
  });

  const existingInventory = await db.inventory.findUnique({
    where: {
      productId: bodyValidation.data.productId,
    },
  });

  if (existingInventory)
    await db.inventory.update({
      where: {
        productId: bodyValidation.data.productId,
      },
      data: {
        possibleSellingPrice:
          existingInventory.possibleSellingPrice > bodyValidation.data.unitPrice
            ? existingInventory.possibleSellingPrice
            : bodyValidation.data.unitPrice,
        quantity: {
          increment: bodyValidation.data.quantity,
        },
      },
    });
  else
    await db.inventory.create({
      data: {
        possibleSellingPrice: bodyValidation.data.unitPrice,
        quantity: bodyValidation.data.quantity,
        productId: bodyValidation.data.productId,
      },
    });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Import created successfully.",
    result: newImport,
  });
});

export const updateImportController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Import ID not provided or invalid.")
    .safeParse(req.params);
  const bodyValidation = importValidator.updateImportSchema.safeParse(req.body);

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

  const existingImport = await db.import.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  if (!existingImport)
    throw RouteError.NotFound("Import not found with the provided ID.");

  const updatedImport = await db.import.update({
    where: {
      id: queryParamValidation.data.id,
    },
    data: bodyValidation.data,
  });

  const inventory = await db.inventory.findUnique({
    where: {
      productId: existingImport.productId,
    },
  });
  if (!inventory)
    throw RouteError.NotFound("Inventory not found for imported product.");

  if (
    bodyValidation.data.quantity &&
    existingImport.quantity !== bodyValidation.data.quantity
  ) {
    const isEnoughQuantity =
      inventory.quantity -
        existingImport.quantity +
        bodyValidation.data.quantity >=
      0;
    if (!isEnoughQuantity)
      throw RouteError.BadRequest(
        "Not enough inventory quantity for import update."
      );
    await db.inventory.update({
      where: { productId: existingImport.productId },
      data: {
        quantity:
          inventory.quantity -
          existingImport.quantity +
          bodyValidation.data.quantity,
      },
    });
  }

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Import updated successfully.",
    result: updatedImport,
  });
});

export const deleteImportController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Import ID not provided or invalid.")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const existingImport = await db.import.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  if (!existingImport)
    throw RouteError.NotFound("Import not found with the provided ID.");

  const inventory = await db.inventory.findUnique({
    where: {
      productId: existingImport.productId,
    },
  });
  if (!inventory)
    throw RouteError.NotFound("Inventory not found for imported product.");

  const isEnoughQuantity = inventory.quantity - existingImport.quantity >= 0;
  if (!isEnoughQuantity)
    throw RouteError.BadRequest(
      "Not enough inventory quantity for import delete."
    );
  await db.inventory.update({
    where: { productId: existingImport.productId },
    data: {
      quantity: inventory.quantity - existingImport.quantity,
    },
  });

  await db.import.delete({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Import deleted successfully.",
    result: null,
  });
});
