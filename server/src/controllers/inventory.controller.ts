import { StatusCodes } from "http-status-codes";
import { asyncWrapper, RouteError, sendApiResponse } from "../utils";
import { db, zodErrorFmt } from "../libs";
import { inventoryValidator, queryParamIDValidator } from "../validators";

export const getInventoriesController = asyncWrapper(async (req, res) => {
  const inventories = await db.inventory.findMany({
    include: {
      product: true,
      supplier: true,
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Inventories retrieved successfully.",
    result: inventories,
  });
});

export const getInventoryByIDController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryParamIDValidator(
    "Inventory ID not provided or invalid."
  ).safeParse(req.params);

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
      supplier: true,
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

export const createInventoryController = asyncWrapper(async (req, res) => {
  const bodyValidation = inventoryValidator.createInventorySchema.safeParse(
    req.body
  );

  if (!bodyValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );

  const newInventory = await db.inventory.create({
    data: bodyValidation.data,
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Inventory created successfully.",
    result: newInventory,
  });
});

export const updateInventoryController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryParamIDValidator(
    "Inventory ID not provided or invalid."
  ).safeParse(req.params);
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
    data: bodyValidation.data,
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
  const queryParamValidation = queryParamIDValidator(
    "Inventory ID not provided or invalid."
  ).safeParse(req.params);

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
