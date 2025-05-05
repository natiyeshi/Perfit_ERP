// import { StatusCodes } from "http-status-codes";
// import { asyncWrapper, RouteError, sendApiResponse } from "../utils";
// import { queryValidator } from "../validators";
// import {  CreateCostBuildUpSchema } from "../validators/costBuildUp.validator";
// import { db, zodErrorFmt } from "../libs";

// export const getcostbuildupsController = asyncWrapper(async (req, res) => {
//   const paginationValiation =
//     queryValidator.paginationsQueryValidator.safeParse(req.query);

//   if (!paginationValiation.success)
//     throw RouteError.BadRequest(
//       zodErrorFmt(paginationValiation.error)[0].message,
//       zodErrorFmt(paginationValiation.error)
//     );

//   const costbuildups = await db.costBuildUp.findMany({
//     take: paginationValiation.data.limit,
//     skip: (paginationValiation.data.page || 1) - 1 || undefined,
//   });

//   return sendApiResponse({
//     res,
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "costbuildups retrieved successfully",
//     result: costbuildups,
//   });
// });

// export const getcostbuildupByIDController = asyncWrapper(async (req, res) => {
//   const queryParamValidation = queryValidator
//     .queryParamIDValidator("costbuildup ID not provided or invalid.")
//     .safeParse(req.params);

//   if (!queryParamValidation.success)
//     throw RouteError.BadRequest(
//       zodErrorFmt(queryParamValidation.error)[0].message,
//       zodErrorFmt(queryParamValidation.error)
//     );

//   const costbuildup = await db.costBuildUp.findUnique({
//     where: {
//       id: Number(queryParamValidation.data.id),
//     },
    
//   });

//   if (!costbuildup)
//     throw RouteError.NotFound("costbuildup not found with the provided ID.");

//   return sendApiResponse({
//     res,
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "costbuildup retrieved successfully",
//     result: costbuildup,
//   });
// });

// export const createcostbuildupController = asyncWrapper(async (req, res) => {
//   const bodyValidation = CreateCostBuildUpSchema.safeParse(
//     req.body
//   );

//   if (!bodyValidation.success)
//     throw RouteError.BadRequest(
//       zodErrorFmt(bodyValidation.error)[0].message,
//       zodErrorFmt(bodyValidation.error)
//     );
//   const newData = {
//     ...bodyValidation.data,
//     fcPurchase : bodyValidation.data.fobPriceUSD * 50,
//     totalFobCostBirr : bodyValidation.data.fobPriceUSD * bodyValidation.data.exchangeRate,
//   }

//   const totalCost = newData.bankServiceCharges + newData.insuranceCharge + newData.fobPriceUSD + newData.totalFobCostBirr + newData.seaFreightCharge + newData.customsDuty + newData.storageCharges + newData.inlandTransport + newData.transitAgentCharge + newData.loadingUnloadingExpenses; 

//   const newcostbuildup = await db.costBuildUp.create({
//     data: {...newData,totalCost, usdPurchasePrice : 0},
//   });

//   return sendApiResponse({
//     res,
//     statusCode: StatusCodes.CREATED,
//     success: true,
//     message: "costbuildup created successfully",
//     result: newcostbuildup,
//   });
// });

// // export const updatecostbuildupController = asyncWrapper(async (req, res) => {
// //   const queryParamValidation = queryValidator
// //     .queryParamIDValidator("costbuildup ID not provided or invalid.")
// //     .safeParse(req.params);
// //   const bodyValidation = costbuildupValidator.updatecostbuildupSchema.safeParse(
// //     req.body
// //   );

// //   if (!queryParamValidation.success)
// //     throw RouteError.BadRequest(
// //       zodErrorFmt(queryParamValidation.error)[0].message,
// //       zodErrorFmt(queryParamValidation.error)
// //     );

// //   if (!bodyValidation.success)
// //     throw RouteError.BadRequest(
// //       zodErrorFmt(bodyValidation.error)[0].message,
// //       zodErrorFmt(bodyValidation.error)
// //     );

// //   const existingcostbuildup = await db.costbuildup.findUnique({
// //     where: {
// //       id: queryParamValidation.data.id,
// //     },
// //     include: {
// //       costbuildupImports: true,
// //     },
// //   });

// //   if (!existingcostbuildup)
// //     throw RouteError.NotFound("costbuildup not found with the provided ID.");

// //   const updatedcostbuildup = await db.costbuildup.update({
// //     where: {
// //       id: queryParamValidation.data.id,
// //     },
// //     data: bodyValidation.data,
// //   });

// //   return sendApiResponse({
// //     res,
// //     statusCode: StatusCodes.OK,
// //     success: true,
// //     message: "costbuildup updated successfully",
// //     result: updatedcostbuildup,
// //   });
// // });

// // export const deletecostbuildupController = asyncWrapper(async (req, res) => {
// //   const queryParamValidation = queryValidator
// //     .queryParamIDValidator("costbuildup ID not provided or invalid.")
// //     .safeParse(req.params);

// //   if (!queryParamValidation.success)
// //     throw RouteError.BadRequest(
// //       zodErrorFmt(queryParamValidation.error)[0].message,
// //       zodErrorFmt(queryParamValidation.error)
// //     );

// //   const existingcostbuildup = await db.costbuildup.findUnique({
// //     where: {
// //       id: queryParamValidation.data.id,
// //     },
// //     include: {
// //       costbuildupImports: true,
// //     },
// //   });

// //   if (!existingcostbuildup)
// //     throw RouteError.NotFound("costbuildup not found with the provided ID.");

// //   await db.costbuildup.delete({
// //     where: {
// //       id: queryParamValidation.data.id,
// //     },
// //   });

// //   return sendApiResponse({
// //     res,
// //     statusCode: StatusCodes.OK,
// //     success: true,
// //     message: "costbuildup deleted successfully",
// //     result: null,
// //   });
// // });
