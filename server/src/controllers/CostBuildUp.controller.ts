import { StatusCodes } from "http-status-codes";
import { asyncWrapper, RouteError, sendApiResponse } from "../utils";
import { queryValidator } from "../validators";
import {  CreateCostBuildUpSchema } from "../validators/costBuildUp.validator";
import { db, zodErrorFmt } from "../libs";



export const createcostbuildupController = asyncWrapper(async (req, res) => {
  const bodyValidation = CreateCostBuildUpSchema.safeParse(req.body);

  if (!bodyValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );

  const {
    fobPriceUSD,
    exchangeRate,
    bankServiceCharges,
    insuranceCharge,
    freightCharge,
    customsDuty,
    storageCharges,
    inlandTransport,
    transitAgentCharge,
    loadingUnloadingExpenses,
    mislaneousCost,
    CostBuildUpProducts,
    ...rest
  } = bodyValidation.data;

  // Calculate derived fields
  const totalFobCostBirr = fobPriceUSD * exchangeRate;
  
  const fcPurchase = fobPriceUSD * totalFobCostBirr;
  
  const bankServiceChargesResult = bankServiceCharges * totalFobCostBirr
  const insuranceChargeResult = insuranceCharge * totalFobCostBirr
  
  const totalCost =
    fcPurchase +
    totalFobCostBirr +
    bankServiceChargesResult +
    insuranceChargeResult +
    freightCharge +
    customsDuty +
    storageCharges +
    inlandTransport +
    transitAgentCharge +
    loadingUnloadingExpenses +
    (mislaneousCost || 0);

  // Create the cost buildup record
  const newcostbuildup = await db.costBuildUp.create({
    data: {
      fobPriceUSD,
      exchangeRate,
      bankServiceCharges,
      insuranceCharge,
      freightCharge,
      customsDuty,
      storageCharges,
      inlandTransport,
      transitAgentCharge,
      loadingUnloadingExpenses,
      mislaneousCost,
      fcPurchase,
      totalFobCostBirr,
      totalCost,
      usdPurchasePrice: 0,
      CostBuildUpProducts: {
        create: CostBuildUpProducts?.map((product: any) => ({
          productId: product.productId,
          unitPrice: product.unitPrice,
          quantity: product.quantity,
          competitorSellingPrice: product.competitorSellingPrice,
          sellingPrice: product.sellingPrice,
        })) || [],
      },
    },
    include: {
      CostBuildUpProducts: true,
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "costbuildup created successfully",
    result: newcostbuildup,
  });
});

// ...existing code...
export const getcostbuildupsController = asyncWrapper(async (req, res) => {
  const paginationValiation =
    queryValidator.paginationsQueryValidator.safeParse(req.query);

  if (!paginationValiation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(paginationValiation.error)[0].message,
      zodErrorFmt(paginationValiation.error)
    );

  const costbuildups = await db.costBuildUp.findMany({
    take: paginationValiation.data.limit,
    skip: (paginationValiation.data.page || 1) - 1 || undefined,
    include: {
      CostBuildUpProducts: {
        include: {
          product: true,
        },
      },
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "costbuildups retrieved successfully",
    result: costbuildups,
  });
});

export const getcostbuildupByIDController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("costbuildup ID not provided or invalid.")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const costbuildup = await db.costBuildUp.findUnique({
    where: {
      id: Number(queryParamValidation.data.id),
    },
    include: {
      CostBuildUpProducts: {
        include: {
          product: true,
        },
      },
    },
    
  });

  if (!costbuildup)
    throw RouteError.NotFound("costbuildup not found with the provided ID.");

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "costbuildup retrieved successfully",
    result: costbuildup,
  });
});

export const updatecostbuildupController = asyncWrapper(async (req, res) => {
  // Validate ID param
  const queryParamValidation = queryValidator
    .queryParamIDValidator("costbuildup ID not provided or invalid.")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  // Validate body
  const bodyValidation = CreateCostBuildUpSchema.safeParse(req.body);

  if (!bodyValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );

  const id = Number(queryParamValidation.data.id);

  // Check if exists
  const existing = await db.costBuildUp.findUnique({
    where: { id },
    include: { CostBuildUpProducts: true },
  });

  if (!existing)
    throw RouteError.NotFound("costbuildup not found with the provided ID.");

  const {
    fobPriceUSD,
    exchangeRate,
    bankServiceCharges,
    insuranceCharge,
    freightCharge,
    customsDuty,
    storageCharges,
    inlandTransport,
    transitAgentCharge,
    loadingUnloadingExpenses,
    mislaneousCost,
    CostBuildUpProducts,
    ...rest
  } = bodyValidation.data;

  // Calculate derived fields
  const totalFobCostBirr = fobPriceUSD * exchangeRate;
  const fcPurchase = fobPriceUSD * totalFobCostBirr;
  const bankServiceChargesResult = bankServiceCharges * totalFobCostBirr;
  const insuranceChargeResult = insuranceCharge * totalFobCostBirr;
  const totalCost =
    fcPurchase +
    totalFobCostBirr +
    bankServiceChargesResult +
    insuranceChargeResult +
    freightCharge +
    customsDuty +
    storageCharges +
    inlandTransport +
    transitAgentCharge +
    loadingUnloadingExpenses +
    (mislaneousCost || 0);

  // Update main record and replace products
  const updated = await db.costBuildUp.update({
    where: { id },
    data: {
      ...rest,
      fobPriceUSD,
      exchangeRate,
      bankServiceCharges,
      insuranceCharge,
      freightCharge,
      customsDuty,
      storageCharges,
      inlandTransport,
      transitAgentCharge,
      loadingUnloadingExpenses,
      mislaneousCost,
      fcPurchase,
      totalFobCostBirr,
      totalCost,
      usdPurchasePrice: 0,
      // Remove all old and add new
      CostBuildUpProducts: {
        deleteMany: {},
        create: CostBuildUpProducts?.map((product: any) => ({
          productId: product.productId,
          unitPrice: product.unitPrice,
          quantity: product.quantity,
          competitorSellingPrice: product.competitorSellingPrice,
          sellingPrice: product.sellingPrice,
        })) || [],
      },
    },
    include: {
      CostBuildUpProducts: {
        include: { product: true },
      },
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "costbuildup updated successfully",
    result: updated,
  });
});