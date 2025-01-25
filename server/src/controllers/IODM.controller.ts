import { StatusCodes } from "http-status-codes";
import { asyncWrapper, sendApiResponse, RouteError } from "../utils";
import { db, zodErrorFmt } from "../libs";
import { IODM_Validator, queryValidator } from "../validators";

/**
 * Get all IODMs with optional pagination and filters
 */
export const getIODMsController = asyncWrapper(async (req, res) => {
  const queryValidation = IODM_Validator.getIODMsQuerySchema.safeParse(
    req.query
  );

  if (!queryValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryValidation.error)[0].message,
      zodErrorFmt(queryValidation.error)
    );

  const isPopulate = queryValidation.data.populate === "true";

  const iodms = await db.iODM.findMany({
    take: queryValidation.data.limit,
    skip: (queryValidation.data.page || 1) - 1 || undefined,
    include: {
      product: isPopulate,
      supplier: isPopulate,
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "IODMs retrieved successfully.",
    result: iodms,
  });
});

/**
 * Get a single IODM by ID
 */
export const getIODMByIDController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("IODM ID not provided or invalid.")
    .safeParse(req.params);

  if (!queryParamValidation.success) {
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );
  }

  const iodm = await db.iODM.findUnique({
    where: { id: queryParamValidation.data.id },
  });

  if (!iodm) {
    throw RouteError.NotFound("IODM not found with the provided ID.");
  }

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "IODM retrieved successfully.",
    result: iodm,
  });
});

/**
 * Create a new IODM
 */
export const createIODMController = asyncWrapper(async (req, res) => {
  const bodyValidation = IODM_Validator.createIODMSchema.safeParse(req.body);

  if (!bodyValidation.success) {
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );
  }

  const { data } = bodyValidation;

  const newIODM = await db.iODM.create({
    data: {
      expiryDate: data.expiryDate,
      manufactureDate: data.manufactureDate,
      purchasePriceUsd: data.purchasePriceUsd,
      currentSellingPrice: data.currentSellingPrice,
      productMovement: data.productMovement,
      transportCost: data.transportCost,
      grossWeight: data.grossWeight,
      cbm: data.cbm,
      freightCost: data.freightCost,
      dutyTax: data.dutyTax,
      bsc: data.bsc,
      shipmentAmount: data.shipmentAmount,
      insuranceCharge: data.insuranceCharge,
      loadingUnloading: data.loadingUnloading,
      exchangeRate: data.exchangeRate,
      supplierId: data.supplierId,
      productId: data.productId,
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "IODM created successfully.",
    result: newIODM,
  });
});

/**
 * Update an existing IODM by ID
 */
export const updateIODMController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("IODM ID not provided or invalid.")
    .safeParse(req.params);

  const bodyValidation = IODM_Validator.updateIODMSchema.safeParse(req.body);

  if (!queryParamValidation.success) {
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );
  }

  if (!bodyValidation.success) {
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );
  }

  const existingIODM = await db.iODM.findUnique({
    where: { id: queryParamValidation.data.id },
  });

  if (!existingIODM) {
    throw RouteError.NotFound("IODM not found with the provided ID.");
  }

  const updatedIODM = await db.iODM.update({
    where: { id: queryParamValidation.data.id },
    data: bodyValidation.data,
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "IODM updated successfully.",
    result: updatedIODM,
  });
});

/**
 * Delete an IODM by ID
 */
export const deleteIODMController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("IODM ID not provided or invalid.")
    .safeParse(req.params);

  if (!queryParamValidation.success) {
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );
  }

  const existingIODM = await db.iODM.findUnique({
    where: { id: queryParamValidation.data.id },
  });

  if (!existingIODM) {
    throw RouteError.NotFound("IODM not found with the provided ID.");
  }

  await db.iODM.delete({
    where: { id: queryParamValidation.data.id },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "IODM deleted successfully.",
    result: null,
  });
});
