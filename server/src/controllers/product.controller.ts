import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";
import { asyncWrapper, RouteError, sendApiResponse } from "../utils";
import { productValidator, queryValidator } from "../validators";
import { cache, db, sendCachedJson, zodErrorFmt } from "../libs";

const PRODUCTS_TTL_MS = 10 * 60 * 1000;
const MAX_PAGE_SIZE = 200; // the table offers up to 100

export const getProductsController = asyncWrapper(async (req, res) => {
  const queryValidation = productValidator.getProductsQuerySchema.safeParse(
    req.query
  );

  if (!queryValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryValidation.error)[0].message,
      zodErrorFmt(queryValidation.error)
    );

  const { limit, page, search, sortBy, order } = queryValidation.data;

  // No `limit`: the full list, used by the product dropdowns on ~8 forms.
  // Cached pre-gzipped and invalidated on writes/sync.
  if (!limit) {
    return sendCachedJson(
      req,
      res,
      cache.PRODUCTS_PREFIX + "list",
      PRODUCTS_TTL_MS,
      async () => ({
        success: true,
        message: "Products retrived successfully",
        result: await db.product.findMany({
          orderBy: {
            brandName: 'asc', // Change 'name' to your desired sort field if needed
          },
        }),
      })
    );
  }

  // Paginated mode (products table): search and sort run in Postgres.
  const pageSize = Math.min(limit, MAX_PAGE_SIZE);
  const currentPage = page && page > 0 ? page : 1;

  const where: Prisma.ProductWhereInput =
    search && search.length > 0
      ? {
          OR: [
            { brandName: { contains: search, mode: "insensitive" } },
            { genericName: { contains: search, mode: "insensitive" } },
            { unit: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

  return sendCachedJson(
    req,
    res,
    cache.cacheKey(cache.PRODUCTS_PREFIX + "page", {
      pageSize, currentPage, search, sortBy, order,
    }),
    PRODUCTS_TTL_MS,
    async () => {
      const [products, total] = await Promise.all([
        db.product.findMany({
          where,
          // id breaks ties so rows never repeat or go missing between pages.
          orderBy: [{ [sortBy ?? "brandName"]: order ?? "asc" }, { id: "asc" }],
          skip: (currentPage - 1) * pageSize,
          take: pageSize,
        }),
        db.product.count({ where }),
      ]);

      return {
        success: true,
        message: "Products retrived successfully",
        result: products,
        meta: {
          total,
          page: currentPage,
          limit: pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    }
  );
});

export const getProductByIDController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Product ID isn't provided or isn't valid")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const product = await db.product.findUnique({
    where: { id: queryParamValidation.data.id },
  });

  if (!product)
    throw RouteError.NotFound("Product not found with the provide ID.");

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product retrived successfully",
    result: product,
  });
});

export const createProductController = asyncWrapper(async (req, res) => {
  // Validator expects array of products
  const bodyValidation = productValidator.createProductsArraySchema.safeParse(
    req.body
  );

  if (!bodyValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );

  const products = await db.product.createMany({
    data: bodyValidation.data,
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.CREATED,
    success: true,
    message: `${
      products.count > 1 ? "Products" : "Product"
    } created successfully`,
    result: products,
  });
});

export const updateProductController = asyncWrapper(async (req, res) => {
  const bodyValidation = productValidator.updateProductSchema.safeParse(
    req.body
  );

  const queryParamValidation = queryValidator
    .queryParamIDValidator("Product ID isn't provided or isn't valid")
    .safeParse(req.params);

  if (!bodyValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const existingProduct = await db.product.findUnique({
    where: { id: queryParamValidation.data.id },
  });

  if (!existingProduct)
    throw RouteError.NotFound("Product not found with the provide ID.");

  const updatedProduct = await db.product.update({
    where: {
      id: queryParamValidation.data.id,
    },
    data: { ...existingProduct, ...bodyValidation.data },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product updated successfully",
    result: updatedProduct,
  });
});

export const deleteProductController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Product ID isn't provided or isn't valid")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const existingProduct = await db.product.findUnique({
    where: { id: queryParamValidation.data.id },
  });

  if (!existingProduct)
    throw RouteError.NotFound("Product not found with the provide ID.");

  const deletedProduct = await db.product.delete({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product deleted successfully",
    result: deletedProduct,
  });
});
