import { StatusCodes } from "http-status-codes";
import {
  asyncWrapper,
  filterByLastDays,
  RouteError,
  sendApiResponse,
} from "../utils";
import { db, zodErrorFmt } from "../libs";
import { competitorInventoryValidator, queryValidator } from "../validators";

export const getCompetitorInventoriesController = asyncWrapper(
  async (req, res) => {
    const queryValidation =
      competitorInventoryValidator.getCompetitorInventoriesQuerySchema.safeParse(
        req.query
      );

    if (!queryValidation.success)
      throw RouteError.BadRequest(
        zodErrorFmt(queryValidation.error)[0].message,
        zodErrorFmt(queryValidation.error)
      );

    const isPopulate = queryValidation.data.populate === "true";

    let competitorInventories = await db.competitorInventory.findMany({
      take: queryValidation.data.limit,
      skip: (queryValidation.data.page || 1) - 1 || undefined,
      include: {
        product: isPopulate,
        competitor: isPopulate,
      },
    });

    if (queryValidation.success && queryValidation.data.days)
      competitorInventories = filterByLastDays<
        (typeof competitorInventories)[0]
      >(competitorInventories, queryValidation.data.days);

    return sendApiResponse({
      res,
      statusCode: StatusCodes.OK,
      success: true,
      message: "Competitor inventories retrieved successfully.",
      result: competitorInventories,
    });
  }
);

export const getCompetitorInventoryByIDController = asyncWrapper(
  async (req, res) => {
    const queryParamValidation = queryValidator
      .queryParamIDValidator("Competitor inventory ID not provided or invalid.")
      .safeParse(req.params);

    if (!queryParamValidation.success)
      throw RouteError.BadRequest(
        zodErrorFmt(queryParamValidation.error)[0].message,
        zodErrorFmt(queryParamValidation.error)
      );

    const competitorInventory = await db.competitorInventory.findUnique({
      where: {
        id: queryParamValidation.data.id,
      },
      include: {
        product: true,
        competitor: true,
      },
    });

    if (!competitorInventory)
      throw RouteError.NotFound(
        "Competitor inventory not found with the provided ID."
      );

    return sendApiResponse({
      res,
      statusCode: StatusCodes.OK,
      success: true,
      message: "Competitor inventory retrieved successfully.",
      result: competitorInventory,
    });
  }
);

export const createCompetitorInventoryController = asyncWrapper(
  async (req, res) => {
    const bodyValidation =
      competitorInventoryValidator.createCompetitorInventorySchema.safeParse(
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
      throw RouteError.BadRequest(
        "Product not found with the provided product ID."
      );

    const existingCompetitor = await db.competitor.findUnique({
      where: {
        id: bodyValidation.data.competitorId,
      },
    });

    if (!existingCompetitor)
      throw RouteError.BadRequest(
        "Competitor not found with the provided competitor ID."
      );

    const competitorInventory = await db.competitorInventory.create({
      data: {
        sellingPrice: bodyValidation.data.sellingPrice,
        competitorId: bodyValidation.data.competitorId,
        productId: bodyValidation.data.productId,
      },
    });

    console.log({
      competitorInventory,
    });

    return sendApiResponse({
      res,
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Competitor import created successfully.",
      result: competitorInventory,
    });
  }
);

export const updateCompetitorInventoryController = asyncWrapper(
  async (req, res) => {
    const queryParamValidation = queryValidator
      .queryParamIDValidator("Competitor inventory ID not provided or invalid.")
      .safeParse(req.params);

    const bodyValidation =
      competitorInventoryValidator.updateCompetitorInventorySchema.safeParse(
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

    if (bodyValidation.data.productId) {
      const existingProduct = await db.product.findUnique({
        where: {
          id: bodyValidation.data.productId,
        },
      });

      if (!existingProduct)
        throw RouteError.BadRequest(
          "Product not found with the provided product ID."
        );
    }

    if (bodyValidation.data.competitorId) {
      const existingCompetitor = await db.competitor.findUnique({
        where: {
          id: bodyValidation.data.competitorId,
        },
      });

      if (!existingCompetitor)
        throw RouteError.BadRequest(
          "Competitor not found with the provided competitor ID."
        );
    }

    const updatedCompetitorInventory = await db.competitorInventory.update({
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
      result: updatedCompetitorInventory,
    });
  }
);

export const deleteCompetitorInventoryController = asyncWrapper(
  async (req, res) => {
    const queryParamValidation = queryValidator
      .queryParamIDValidator("Competitor inventory ID not provided or invalid.")
      .safeParse(req.params);

    if (!queryParamValidation.success)
      throw RouteError.BadRequest(
        zodErrorFmt(queryParamValidation.error)[0].message,
        zodErrorFmt(queryParamValidation.error)
      );

    await db.competitorInventory.delete({
      where: {
        id: queryParamValidation.data.id,
      },
    });

    return sendApiResponse({
      res,
      statusCode: StatusCodes.OK,
      success: true,
      message: "Competitor inventory deleted successfully.",
      result: null,
    });
  }
);
