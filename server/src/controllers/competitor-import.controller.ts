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
      product: isPopulate,
      supplier: isPopulate,
      competitor: isPopulate,
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

    const existingProduct = await db.product.findUnique({
      where: {
        id: bodyValidation.data.productId,
      },
    });

    if (!existingProduct)
      throw RouteError.BadRequest("Invalid product ID. Product not found.");

    const existingCompetitor = await db.competitor.findUnique({
      where: {
        id: bodyValidation.data.competitorId,
      },
    });

    if (!existingCompetitor)
      throw RouteError.BadRequest(
        "Invalid competitor ID. Competitor not found."
      );

    const existingSupplier = await db.supplier.findUnique({
      where: {
        id: bodyValidation.data.supplierId,
      },
    });

    if (!existingSupplier)
      throw RouteError.BadRequest("Invalid supplier ID. Supplier not found.");

    const competitorImport = await db.competitorImport.create({
      data: bodyValidation.data,
    });

    console.log({
      competitorImport,
    });

    if (existingCompetitor.isDirectCompetitor) {
      const existingCompetitorInventory =
        await db.competitorInventory.findUnique({
          where: {
            productId: competitorImport.productId,
          },
        });

      if (!existingCompetitorInventory) {
        await db.competitorInventory.create({
          data: {
            productId: competitorImport.productId,
            sellingPrice: competitorImport.unitPrice,
          },
        });
      } else {
        await db.competitorInventory.update({
          where: {
            productId: competitorImport.productId,
          },
          data: {
            sellingPrice:
              existingCompetitorInventory.sellingPrice >
              competitorImport.unitPrice
                ? existingCompetitorInventory.sellingPrice
                : competitorImport.unitPrice,
          },
        });
      }
    }

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
