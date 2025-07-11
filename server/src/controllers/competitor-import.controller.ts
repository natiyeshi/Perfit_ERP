import { StatusCodes } from "http-status-codes";
import {
  asyncWrapper,
  filterByLastDays,
  RouteError,
  sendApiResponse,
} from "../utils";
import { db, zodErrorFmt } from "../libs";
import { competitorImportValidator, queryValidator } from "../validators";

export const getCompetitorImportsController = asyncWrapper(async (req, res) => {
  const queryValidation =
    competitorImportValidator.getCompetitorImportsQuerySchema.safeParse(
      req.query
    );

  if (!queryValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryValidation.error)[0].message,
      zodErrorFmt(queryValidation.error)
    );

  const isPopulate = queryValidation.data.populate === "true";

  let competitorImports = await db.competitorImport.findMany({
    take: queryValidation.data.limit,
    skip: (queryValidation.data.page || 1) - 1 || undefined,
    include: {
      products: {
        include: {
          product: true,
        },
      },
      supplier: true,
      competitor: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  if (queryValidation.success && queryValidation.data.days)
    competitorImports = filterByLastDays<(typeof competitorImports)[0]>(
      competitorImports,
      queryValidation.data.days
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
        products: {
          include : {
            product: true,
          }
        },
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
