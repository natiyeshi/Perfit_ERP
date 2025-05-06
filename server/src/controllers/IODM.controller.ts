import { StatusCodes } from "http-status-codes";
import { asyncWrapper, sendApiResponse, RouteError } from "../utils";
import { db, zodErrorFmt } from "../libs";
import { IODM_Validator, queryValidator } from "../validators";
import { MOVEMENT } from "@prisma/client";

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
      // IODMProducts: isPopulate,
      IODMProducts: {
        include: {product: isPopulate},},
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
    include: {
      IODMProducts: {
        include: {product: true},},
      supplier: true,
    },
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
  console.log(req.body)
  const bodyValidation = IODM_Validator.IODMSchema.safeParse(req.body);

  if (!bodyValidation.success) {
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );
  }

  const { data } = bodyValidation;

  const newIODM = await db.iODM.create({
    data: {
      bsc: req.body.bsc,
      dutyTax: req.body.dutyTax,
      supplierId: req.body.supplierId,
      loadingUnloading: req.body.loadingUnloading,
      exchangeRate: req.body.exchangeRate,
      insuranceCharge: req.body.insuranceCharge,
      freightCost: req.body.freightCost,
      miscellaneousTax: req.body.miscellaneousTax,
      IODMProducts: {
        create: req.body.IODMProducts.map((product: any) => ({
          productId: product.productId,
          purchasePriceUsd: product.purchasePriceUsd,
          currentSellingPrice: product.currentSellingPrice,
          productMovement: product.productMovement as MOVEMENT,
          expiryDate: new Date(product.expiryDate),
          manufactureDate: new Date(product.manufactureDate),
          quantity: product.quantity,
        })),
      },
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
// export const updateIODMController = asyncWrapper(async (req, res) => {
//   const queryParamValidation = queryValidator
//     .queryParamIDValidator("IODM ID not provided or invalid.")
//     .safeParse(req.params);

//   const bodyValidation = IODM_Validator.updateIODMSchema.safeParse(req.body);

//   if (!queryParamValidation.success) {
//     throw RouteError.BadRequest(
//       zodErrorFmt(queryParamValidation.error)[0].message,
//       zodErrorFmt(queryParamValidation.error)
//     );
//   }

//   if (!bodyValidation.success) {
//     throw RouteError.BadRequest(
//       zodErrorFmt(bodyValidation.error)[0].message,
//       zodErrorFmt(bodyValidation.error)
//     );
//   }

//   const existingIODM = await db.iODM.findUnique({
//     where: { id: queryParamValidation.data.id },
//   });

//   if (!existingIODM) {
//     throw RouteError.NotFound("IODM not found with the provided ID.");
//   }

//   const updatedIODM = await db.iODM.update({
//     where: { id: queryParamValidation.data.id },
//     data: bodyValidation.data,
//   });

//   return sendApiResponse({
//     res,
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "IODM updated successfully.",
//     result: updatedIODM,
//   });
// });

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

  
  await db.$transaction(async (prisma) => {
    await prisma.iODMProduct.deleteMany({
      where: { IODMId: queryParamValidation.data.id },
    });
    await prisma.iODM.delete({
      where: { id: queryParamValidation.data.id },
    });
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "IODM deleted successfully.",
    result: null,
  });
});
