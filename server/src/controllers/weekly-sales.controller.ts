import { StatusCodes } from "http-status-codes";
import {
  asyncWrapper,
  filterByLastDays,
  RouteError,
  sendApiResponse,
} from "../utils";
import { db, zodErrorFmt } from "../libs";
import { weeklySalesValidator, queryValidator } from "../validators";

export const getWeeklySalesController = asyncWrapper(async (req, res) => {
  const queryValidation =
    weeklySalesValidator.getWeeklySalesQuerySchema.safeParse(req.query);

  if (!queryValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryValidation.error)[0].message,
      zodErrorFmt(queryValidation.error)
    );

  let weeklySales = await db.weeklySales.findMany({
    take: queryValidation.data.limit,
    skip: (queryValidation.data.page || 1) - 1 || undefined,
  });

  if (queryValidation.success && queryValidation.data.days)
    weeklySales = filterByLastDays<(typeof weeklySales)[0]>(
      weeklySales,
      queryValidation.data.days
    );

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Weekly sales retrieved successfully.",
    result: weeklySales,
  });
});

export const getWeeklySaleByIDController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Weekly Sale ID not provided or invalid.")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const existingSale = await db.weeklySales.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  if (!existingSale)
    throw RouteError.NotFound("Weekly Sale not found with the provided ID.");

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Weekly sale retrieved successfully.",
    result: existingSale,
  });
});

export const createWeeklySaleController = asyncWrapper(async (req, res) => {
  const bodyValidation = weeklySalesValidator.createWeeklySalesSchema.safeParse(
    req.body
  );

  if (!bodyValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );

  const newSale = await db.weeklySales.create({
    data: bodyValidation.data,
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Weekly sale created successfully.",
    result: newSale,
  });
});

export const updateWeeklySaleController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Weekly Sale ID not provided or invalid.")
    .safeParse(req.params);
  const bodyValidation = weeklySalesValidator.updateWeeklySalesSchema.safeParse(
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

  const updatedSale = await db.weeklySales.update({
    where: {
      id: queryParamValidation.data.id,
    },
    data: bodyValidation.data,
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Weekly sale updated successfully.",
    result: updatedSale,
  });
});

export const deleteWeeklySaleController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Weekly Sale ID not provided or invalid.")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const existingSale = await db.weeklySales.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  if (!existingSale)
    throw RouteError.NotFound("Weekly Sale not found with the provided ID.");

  await db.weeklySales.delete({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Weekly sale deleted successfully.",
    result: null,
  });
});
