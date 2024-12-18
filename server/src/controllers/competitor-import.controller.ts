import { StatusCodes } from "http-status-codes";
import { asyncWrapper, RouteError, sendApiResponse } from "../utils";
import { db, zodErrorFmt } from "../libs";
import {
  competitorImportValidator,
  queryParamIDValidator,
} from "../validators";

export const getCompetitorImportsController = asyncWrapper(async (req, res) => {
  const competitorImports = await db.competitorImport.findMany({
    include: {
      product: true,
      supplier: true,
      competitor: true,
    },
  });

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
    const queryParamValidation = queryParamIDValidator(
      "Competitor Import ID not provided or invalid."
    ).safeParse(req.params);

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
    const queryParamValidation = queryParamIDValidator(
      "Competitor Import ID not provided or invalid."
    ).safeParse(req.params);
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
    const queryParamValidation = queryParamIDValidator(
      "Competitor Import ID not provided or invalid."
    ).safeParse(req.params);

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
