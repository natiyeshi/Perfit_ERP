import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";
import {
  asyncWrapper,
  RouteError,
  sendApiResponse,
} from "../utils";
import { cache, db, zodErrorFmt } from "../libs";
import { competitorImportValidator, queryValidator } from "../validators";

// Analytics only change on the hourly sync or a write request, both of which
// clear the cache; the TTL just bounds staleness from out-of-process writes.
const ANALYTICS_TTL_MS = 10 * 60 * 1000;

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

/**
 * Average unit price per product (by generic name), computed entirely in
 * Postgres with GROUP BY + AVG and returned one page at a time. This replaces
 * the old client-side O(n^2) aggregation over the full dataset.
 */
export const getAverageUnitPriceController = asyncWrapper(async (req, res) => {
  const queryValidation =
    competitorImportValidator.getAverageUnitPriceQuerySchema.safeParse(
      req.query
    );

  if (!queryValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryValidation.error)[0].message,
      zodErrorFmt(queryValidation.error)
    );

  const { days, search } = queryValidation.data;
  const limit = queryValidation.data.limit ?? 20;
  const page = queryValidation.data.page && queryValidation.data.page > 0
    ? queryValidation.data.page
    : 1;
  const offset = (page - 1) * limit;
  const order = queryValidation.data.order === "asc" ? "ASC" : "DESC";

  const threshold = days
    ? new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    : null;
  const searchTerm = search && search.length > 0 ? `%${search}%` : null;

  // Shared WHERE fragment (parameterised) reused by the page + count queries.
  const whereSql = Prisma.sql`
    WHERE (${threshold}::timestamp IS NULL OR ci."date" >= ${threshold})
      AND (${searchTerm}::text IS NULL OR p."genericName" ILIKE ${searchTerm})
  `;

  const rowsPromise = db.$queryRaw<
    { name: string; avgUnitPrice: number; count: number }[]
  >(Prisma.sql`
    SELECT p."genericName" AS name,
           AVG(pwp."unitPrice")::float8 AS "avgUnitPrice",
           COUNT(*)::int AS count
    FROM "_CompetitorImportToProductWithPrice" j
    JOIN "competitor_imports" ci ON ci."id" = j."A"
    JOIN "ProductWithPrice" pwp ON pwp."id" = j."B"
    JOIN "products" p ON p."id" = pwp."productId"
    ${whereSql}
    GROUP BY p."genericName"
    ORDER BY "avgUnitPrice" ${Prisma.raw(order)}
    LIMIT ${limit} OFFSET ${offset}
  `);

  const totalPromise = db.$queryRaw<{ total: number }[]>(Prisma.sql`
    SELECT COUNT(*)::int AS total FROM (
      SELECT p."genericName"
      FROM "_CompetitorImportToProductWithPrice" j
      JOIN "competitor_imports" ci ON ci."id" = j."A"
      JOIN "ProductWithPrice" pwp ON pwp."id" = j."B"
      JOIN "products" p ON p."id" = pwp."productId"
      ${whereSql}
      GROUP BY p."genericName"
    ) t
  `);

  // Prisma raw queries are lazy, so on a cache hit neither query runs.
  const [rows, totalRows] = await cache.getOrSetCache(
    cache.cacheKey(cache.ANALYTICS_PREFIX + "average-unit-price", {
      days, search, limit, page, order,
    }),
    ANALYTICS_TTL_MS,
    () => Promise.all([rowsPromise, totalPromise])
  );
  const total = totalRows[0]?.total ?? 0;

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Average unit price per product retrieved successfully.",
    result: rows,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

/**
 * Top/bottom aggregations for the import report charts, computed in Postgres.
 * One endpoint serves several charts via the `metric` param, each returning a
 * tiny `{ name, value }[]` instead of shipping the full dataset to the browser.
 */
export const getImportAnalyticsController = asyncWrapper(async (req, res) => {
  const queryValidation =
    competitorImportValidator.getImportAnalyticsQuerySchema.safeParse(req.query);

  if (!queryValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryValidation.error)[0].message,
      zodErrorFmt(queryValidation.error)
    );

  const { metric, days } = queryValidation.data;
  const limit = queryValidation.data.limit ?? 10;
  const order = queryValidation.data.order === "asc" ? "ASC" : "DESC";
  const threshold = days
    ? new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    : null;

  const dateFilter = Prisma.sql`(${threshold}::timestamp IS NULL OR ci."date" >= ${threshold})`;

  let sql: Prisma.Sql;
  switch (metric) {
    // Sum of import amount (column is mapped to "unit_price") per competitor.
    case "competitor_total_price":
      sql = Prisma.sql`
        SELECT c."name" AS name, SUM(ci."unit_price")::float8 AS value
        FROM "competitor_imports" ci
        JOIN "competitors" c ON c."id" = ci."competitorId"
        WHERE ${dateFilter}
        GROUP BY c."name"
        ORDER BY value ${Prisma.raw(order)}
        LIMIT ${limit}
      `;
      break;
    // Sum of quantity * unit price per supplier.
    case "supplier_total_value":
      sql = Prisma.sql`
        SELECT s."manufacturerName" AS name,
               SUM(pwp."quantity" * pwp."unitPrice")::float8 AS value
        FROM "competitor_imports" ci
        JOIN "suppliers" s ON s."id" = ci."supplierId"
        JOIN "_CompetitorImportToProductWithPrice" j ON j."A" = ci."id"
        JOIN "ProductWithPrice" pwp ON pwp."id" = j."B"
        WHERE ${dateFilter}
        GROUP BY s."manufacturerName"
        ORDER BY value ${Prisma.raw(order)}
        LIMIT ${limit}
      `;
      break;
    // Sum of imported quantity per product brand (top = DESC, least = ASC).
    case "product_quantity":
      sql = Prisma.sql`
        SELECT p."brandName" AS name, SUM(pwp."quantity")::float8 AS value
        FROM "competitor_imports" ci
        JOIN "_CompetitorImportToProductWithPrice" j ON j."A" = ci."id"
        JOIN "ProductWithPrice" pwp ON pwp."id" = j."B"
        JOIN "products" p ON p."id" = pwp."productId"
        WHERE ${dateFilter}
        GROUP BY p."brandName"
        ORDER BY value ${Prisma.raw(order)}
        LIMIT ${limit}
      `;
      break;
  }

  const rows = await cache.getOrSetCache(
    cache.cacheKey(cache.ANALYTICS_PREFIX + "top", { metric, days, limit, order }),
    ANALYTICS_TTL_MS,
    () => db.$queryRaw<{ name: string; value: number }[]>(sql)
  );

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Import analytics retrieved successfully.",
    result: rows,
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

/**
 * Dashboard "Customer Sales" / "Product Sales" tables, aggregated in Postgres.
 * Same numbers the dashboard used to compute in the browser from the full
 * `/competitor-imports?populate=true` payload (~7 MB), but returns only the
 * grouped rows.
 */
export const getDashboardReportController = asyncWrapper(async (_req, res) => {
  const result = await cache.getOrSetCache(
    cache.ANALYTICS_PREFIX + "dashboard-report",
    ANALYTICS_TTL_MS,
    async () => {
      const [customers, productSales] = await Promise.all([
        db.$queryRaw<{ name: string; sales: number; transactions: number }[]>`
          SELECT c."name" AS name,
                 SUM(ci."unit_price")::float8 AS sales,
                 COUNT(*)::int AS transactions
          FROM "competitor_imports" ci
          JOIN "competitors" c ON c."id" = ci."competitorId"
          GROUP BY c."name"
          ORDER BY sales DESC
        `,
        db.$queryRaw<
          { id: string; name: string; unit: string; soldQuantity: number; soldAmount: number }[]
        >`
          SELECT p."id" AS id,
                 COALESCE(NULLIF(p."genericName", ''), 'Unknown Product') AS name,
                 COALESCE(NULLIF(p."unit", ''), 'pcs') AS unit,
                 SUM(pwp."quantity")::float8 AS "soldQuantity",
                 SUM(pwp."unitPrice" * pwp."quantity")::float8 AS "soldAmount"
          FROM "competitor_imports" ci
          JOIN "_CompetitorImportToProductWithPrice" j ON j."A" = ci."id"
          JOIN "ProductWithPrice" pwp ON pwp."id" = j."B"
          JOIN "products" p ON p."id" = pwp."productId"
          GROUP BY p."id"
          ORDER BY "soldAmount" DESC
        `,
      ]);

      const customerSales = customers.map((c) => ({
        ...c,
        averageSale: c.sales / c.transactions,
      }));
      return { customerSales, productSales };
    }
  );

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Dashboard report retrieved successfully.",
    result,
  });
});

/**
 * Charts on the import pipeline report page. Mirrors the page's original
 * client-side logic: the time filter is `createdAt > now - N months`, and every
 * name that appears in ANY import is kept with 0 when it has nothing inside the
 * window (so "least imported" can include zeros, as before).
 */
export const getPipelineReportController = asyncWrapper(async (req, res) => {
  const queryValidation =
    competitorImportValidator.getPipelineReportQuerySchema.safeParse(req.query);

  if (!queryValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryValidation.error)[0].message,
      zodErrorFmt(queryValidation.error)
    );

  const { chart, months } = queryValidation.data;

  // created_at is a timezone-less column holding UTC (Prisma's convention), so
  // compare against UTC "now" explicitly; plain now() would be shifted by the
  // DB session's TimeZone setting.
  const inWindow = months
    ? Prisma.sql`ci."created_at" > (now() AT TIME ZONE 'UTC') - make_interval(months => ${months}::int)`
    : Prisma.sql`TRUE`;

  // Ties are broken in the order the browser used to first encounter each name:
  // imports by date desc, then products within an import by id (Prisma's order).
  const compute = async () => {
    type Row = { name: string; value: number };
    switch (chart) {
      case "top_products":
      case "least_products": {
        const rows = await db.$queryRaw<Row[]>`
          SELECT p."genericName" AS name,
                 SUM(CASE WHEN ${inWindow} THEN pwp."quantity" ELSE 0 END)::float8 AS value
          FROM "competitor_imports" ci
          JOIN "_CompetitorImportToProductWithPrice" j ON j."A" = ci."id"
          JOIN "ProductWithPrice" pwp ON pwp."id" = j."B"
          JOIN "products" p ON p."id" = pwp."productId"
          GROUP BY p."genericName"
          ORDER BY value ${Prisma.raw(chart === "top_products" ? "DESC" : "ASC")},
                   MAX(ci."date") DESC,
                   (array_agg(pwp."id" ORDER BY ci."date" DESC, pwp."id"))[1]
        `;
        if (chart === "least_products") return rows.slice(0, 4);

        const top = rows.slice(0, 4);
        const othersValue = rows.slice(4).reduce((sum, r) => sum + r.value, 0);
        if (othersValue > 0) top.push({ name: "Others", value: othersValue });
        return top;
      }
      case "top_suppliers":
        return db.$queryRaw<Row[]>`
          SELECT s."manufacturerName" AS name,
                 SUM(CASE WHEN ${inWindow} THEN ci."unit_price" ELSE 0 END)::float8 AS value
          FROM "competitor_imports" ci
          JOIN "suppliers" s ON s."id" = ci."supplierId"
          GROUP BY s."manufacturerName"
          ORDER BY value DESC, MAX(ci."date") DESC
          LIMIT 4
        `;
      case "top_competitors":
        // Total product quantity per competitor. LEFT JOINs keep competitors
        // whose imports have no products (value 0), like the old chart did.
        return db.$queryRaw<Row[]>`
          SELECT c."name" AS name,
                 COALESCE(SUM(CASE WHEN ${inWindow} THEN pwp."quantity" ELSE 0 END), 0)::float8 AS value
          FROM "competitor_imports" ci
          JOIN "competitors" c ON c."id" = ci."competitorId"
          LEFT JOIN "_CompetitorImportToProductWithPrice" j ON j."A" = ci."id"
          LEFT JOIN "ProductWithPrice" pwp ON pwp."id" = j."B"
          GROUP BY c."name"
          ORDER BY value DESC, MAX(ci."date") DESC
          LIMIT 4
        `;
    }
  };

  const result = await cache.getOrSetCache(
    cache.cacheKey(cache.ANALYTICS_PREFIX + "pipeline-report", { chart, months }),
    ANALYTICS_TTL_MS,
    compute
  );

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Pipeline report retrieved successfully.",
    result,
  });
});
