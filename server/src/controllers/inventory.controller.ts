import { StatusCodes } from "http-status-codes";
import {
  asyncWrapper,
  filterByLastDays,
  RouteError,
  sendApiResponse,
} from "../utils";
import { db, zodErrorFmt } from "../libs";
import { inventoryValidator, queryValidator } from "../validators";

export const getInventoriesController = asyncWrapper(async (req, res) => {
  const queryValidation =
    inventoryValidator.getCompetitorImportsQuerySchema.safeParse(req.query);

  if (!queryValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryValidation.error)[0].message,
      zodErrorFmt(queryValidation.error)
    );

  const isPopulate = queryValidation.data.populate === "true";

  let inventories = await db.inventory.findMany({
    take: queryValidation.data.limit,
    skip: (queryValidation.data.page || 1) - 1 || undefined,
    include: {
      product: isPopulate,
    },
  });

  if (queryValidation.success && queryValidation.data.days)
    inventories = filterByLastDays<(typeof inventories)[0]>(
      inventories,
      queryValidation.data.days
    );

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Inventories retrieved successfully.",
    result: inventories,
  });
});

export const getAvailableProductsController = asyncWrapper(async (req, res) => {
  const products = await db.inventory.findMany({
    where: {
      quantity: {
        gt: 0,
      },

      },
      select: {
        product: true,
        quantity: true,
      },
    });

    return sendApiResponse({
      res,
      statusCode: StatusCodes.OK,
      success: true,
      message: "Available products retrieved successfully.",
      result: products,
    });
  });
export const getInventoryByIDController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Inventory ID not provided or invalid.")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const inventory = await db.inventory.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
    include: {
      product: true,
    },
  });

  if (!inventory)
    throw RouteError.NotFound("Inventory not found with the provided ID.");

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Inventory retrieved successfully.",
    result: inventory,
  });
});

export const updateInventoryController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Inventory ID not provided or invalid.")
    .safeParse(req.params);
  const bodyValidation = inventoryValidator.updateInventorySchema.safeParse(
    req.body
  );

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

  const existingInventory = await db.inventory.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  if (!existingInventory)
    throw RouteError.NotFound("Inventory not found with the provided ID.");

  const updatedInventory = await db.inventory.update({
    where: {
      id: queryParamValidation.data.id,
    },
    data: {
      possibleSellingPrice: bodyValidation.data.possibleSellingPrice,
      quantity: bodyValidation.data.quantity,
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Inventory updated successfully.",
    result: updatedInventory,
  });
});

export const deleteInventoryController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Inventory ID not provided or invalid.")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const existingInventory = await db.inventory.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  if (!existingInventory)
    throw RouteError.NotFound("Inventory not found with the provided ID.");

  await db.inventory.delete({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Inventory deleted successfully.",
    result: null,
  });
});
