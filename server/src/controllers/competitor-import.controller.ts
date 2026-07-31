import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";
import {
  asyncWrapper,
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

  const { limit, page, days, search, sortBy, order } = queryValidation.data;

  // Build a DB-level WHERE clause so filtering happens in Postgres, not in Node.
  const where: Prisma.CompetitorImportWhereInput = {};

  if (days) {
    const threshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    where.date = { gte: threshold };
  }

  if (search && search.length > 0) {
    where.OR = [
      { importId: { contains: search, mode: "insensitive" } },
      { competitor: { is: { name: { contains: search, mode: "insensitive" } } } },
      {
        supplier: {
          is: { manufacturerName: { contains: search, mode: "insensitive" } },
        },
      },
    ];
  }

  const orderBy: Prisma.CompetitorImportOrderByWithRelationInput = {
    [sortBy ?? "date"]: order ?? "desc",
  };

  const include = {
    products: {
      include: {
        product: true,
      },
    },
    supplier: true,
    competitor: true,
  } satisfies Prisma.CompetitorImportInclude;

  // Legacy mode: no `limit` provided -> return every matching row (used by the
  // report page). Paginated mode kicks in as soon as a `limit` is supplied.
  if (!limit) {
    const competitorImports = await db.competitorImport.findMany({
      where,
      include,
      orderBy,
    });

    return sendApiResponse({
      res,
      statusCode: StatusCodes.OK,
      success: true,
      message: "Competitor imports retrieved successfully.",
      result: competitorImports,
    });
  }

  const currentPage = page && page > 0 ? page : 1;
  const skip = (currentPage - 1) * limit;

  const [competitorImports, total, sum] = await Promise.all([
    db.competitorImport.findMany({
      where,
      include,
      orderBy,
      skip,
      take: limit,
    }),
    db.competitorImport.count({ where }),
    db.competitorImport.aggregate({ where, _sum: { amount: true } }),
  ]);

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Competitor imports retrieved successfully.",
    result: competitorImports,
    meta: {
      total,
      page: currentPage,
      limit,
      totalPages: Math.ceil(total / limit),
      sumAmount: sum._sum.amount ?? 0,
    },
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
