import { StatusCodes } from "http-status-codes";
import {
  asyncWrapper,
  filterByLastDays,
  RouteError,
  sendApiResponse,
} from "../utils";
import { db, zodErrorFmt } from "../libs";
import { competitorImportValidator, queryValidator } from "../validators";
import { CompetitorImport } from "@prisma/client";

export const getCompetitorImportsController = asyncWrapper(async (req, res) => {
  const paginationValiation =
    queryValidator.paginationsQueryValidator.safeParse(req.query);

  const lastDaysValidation = queryValidator.lastDaysQueryValidator.safeParse(
    req.query
  );

  if (!paginationValiation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(paginationValiation.error)[0].message,
      zodErrorFmt(paginationValiation.error)
    );

  if (!lastDaysValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(lastDaysValidation.error)[0].message,
      zodErrorFmt(lastDaysValidation.error)
    );

  let competitorImports = await db.competitorImport.findMany({
    take: paginationValiation.data.limit,
    skip: (paginationValiation.data.page || 1) - 1 || undefined,
  });

  if (lastDaysValidation.success && lastDaysValidation.data.days)
    competitorImports = filterByLastDays<CompetitorImport>(
      competitorImports,
      lastDaysValidation.data.days
    );

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Competitor imports retrieved successfully.",
    result: competitorImports,
  });
});

export const getCompetitorImportByIDController = asyncWrapper(
  async (req, res) => {
    const queryParamValidation = queryValidator
      .queryParamIDValidator("Competitor Import ID not provided or invalid.")
      .safeParse(req.params);

    if (!queryParamValidation.success)
      throw RouteError.BadRequest(
        zodErrorFmt(queryParamValidation.error)[0].message,
        zodErrorFmt(queryParamValidation.error)
      );

    const competitorImport = await db.competitorImport.findUnique({
      where: {
        id: queryParamValidation.data.id,
      },
      include: {
        product: true,
        supplier: true,
        competitor: true,
      },
    });

    if (!competitorImport)
      throw RouteError.NotFound(
        "Competitor import not found with the provided ID."
      );

    return sendApiResponse({
      res,
      statusCode: StatusCodes.OK,
      success: true,
      message: "Competitor import retrieved successfully.",
      result: competitorImport,
    });
  }
);

export const createCompetitorImportController = asyncWrapper(
  async (req, res) => {
    const bodyValidation =
      competitorImportValidator.createCompetitorImportSchema.safeParse(
        req.body
      );

    if (!bodyValidation.success)
      throw RouteError.BadRequest(
        zodErrorFmt(bodyValidation.error)[0].message,
        zodErrorFmt(bodyValidation.error)
      );

    const competitorImport = await db.competitorImport.create({
      data: bodyValidation.data,
    });

    return sendApiResponse({
      res,
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Competitor import created successfully.",
      result: competitorImport,
    });
  }
);

export const updateCompetitorImportController = asyncWrapper(
  async (req, res) => {
    const queryParamValidation = queryValidator
      .queryParamIDValidator("Competitor Import ID not provided or invalid.")
      .safeParse(req.params);
    const bodyValidation =
      competitorImportValidator.updateCompetitorImportSchema.safeParse(
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

    const updatedCompetitorImport = await db.competitorImport.update({
      where: {
        id: queryParamValidation.data.id,
      },
      data: bodyValidation.data,
    });

    return sendApiResponse({
      res,
      statusCode: StatusCodes.OK,
      success: true,
      message: "Competitor import updated successfully.",
      result: updatedCompetitorImport,
    });
  }
);

export const deleteCompetitorImportController = asyncWrapper(
  async (req, res) => {
    const queryParamValidation = queryValidator
      .queryParamIDValidator("Competitor Import ID not provided or invalid.")
      .safeParse(req.params);

    if (!queryParamValidation.success)
      throw RouteError.BadRequest(
        zodErrorFmt(queryParamValidation.error)[0].message,
        zodErrorFmt(queryParamValidation.error)
      );

    await db.competitorImport.delete({
      where: {
        id: queryParamValidation.data.id,
      },
    });

    return sendApiResponse({
      res,
      statusCode: StatusCodes.OK,
      success: true,
      message: "Competitor import deleted successfully.",
      result: null,
    });
  }
);
