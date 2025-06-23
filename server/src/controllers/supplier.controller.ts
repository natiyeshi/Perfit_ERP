import { StatusCodes } from "http-status-codes";
import { asyncWrapper, RouteError, sendApiResponse } from "../utils";
import { queryValidator, supplierValidator } from "../validators";
import { db, zodErrorFmt } from "../libs";

// Get all suppliers
export const getSuppliersController = asyncWrapper(async (req, res) => {
  const paginationValiation =
    queryValidator.paginationsQueryValidator.safeParse(req.query);

  if (!paginationValiation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(paginationValiation.error)[0].message,
      zodErrorFmt(paginationValiation.error)
    );
  const suppliers = await db.supplier.findMany({
    include: {
      competitorImports: true,
      imports: true,
      deliverableProducts: true,
    },
    take: paginationValiation.data.limit,
    skip: (paginationValiation.data.page || 1) - 1 || undefined,
    orderBy: {
      manufacturerName: 'asc', // Change 'name' to your desired sort field if needed
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Suppliers retrieved successfully",
    result: suppliers,
  });
});

// Get supplier by ID
export const getSupplierByIdController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Supplier ID not provided or invalid.")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const supplier = await db.supplier.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
    include: {
      competitorImports: true,
      imports: true,
      deliverableProducts: true,
    },
  });

  if (!supplier)
    throw RouteError.NotFound("Supplier not found with the provided ID.");

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Supplier retrieved successfully",
    result: supplier,
  });
});

export const createSupplierController = asyncWrapper(async (req, res) => {
  const bodyValidation = supplierValidator.createSupplierSchema.safeParse(
    req.body
  );

  if (!bodyValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );

  if (bodyValidation.data.email) {
    const existingSupplier = await db.supplier.findFirst({
      where: {
        email: bodyValidation.data.email,
      },
    });

    if (existingSupplier) throw RouteError.BadRequest("Email already exists.");
  }

  const products =
    bodyValidation.data.productIDs && bodyValidation.data.productIDs.length > 0
      ? await db.product.findMany({
          where: {
            id: { in: bodyValidation.data.productIDs },
          },
        })
      : [];

  const { productIDs, ...supplierDTO } = bodyValidation.data;

  const supplier = await db.supplier.create({
    data: {
      ...supplierDTO,
      deliverableProducts: {
        connect: products,
      },
    },
    include: {
      deliverableProducts: true,
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Supplier created successfully",
    result: supplier,
  });
});

// Update supplier details
export const updateSupplierController = asyncWrapper(async (req, res) => {
  const bodyValidation = supplierValidator.updateSupplierSchema.safeParse(
    req.body
  );
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Supplier ID not provided or invalid.")
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

  const existingSupplier = await db.supplier.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  if (!existingSupplier)
    throw RouteError.NotFound("Supplier not found with the provided ID.");

  const products =
    bodyValidation.data.productIDs && bodyValidation.data.productIDs.length > 0
      ? await db.product.findMany({
          where: {
            id: { in: bodyValidation.data.productIDs },
          },
        })
      : [];

  const { productIDs, ...restAtt } = bodyValidation.data;

  const updatedSupplier = await db.supplier.update({
    where: {
      id: queryParamValidation.data.id,
    },
    data: {
      ...restAtt,
      deliverableProducts: {
        set: products,
      },
    },
    include: {
      competitorImports: true,
      imports: true,
      deliverableProducts: true,
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Supplier updated successfully",
    result: updatedSupplier,
  });
});

// Delete supplier
export const deleteSupplierController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Supplier ID not provided or invalid.")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const existingSupplier = await db.supplier.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  if (!existingSupplier)
    throw RouteError.NotFound("Supplier not found with the provided ID.");

  await db.supplier.delete({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Supplier deleted successfully",
    result: null,
  });
});

export const createMultipleSuppliersController = asyncWrapper(async (req, res) => {
  const bodyValidation = supplierValidator.createMultipleSuppliersSchema.safeParse(
    req.body
  );

  if (!bodyValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );

  // Get the suppliers array from either format
  const suppliers = Array.isArray(bodyValidation.data) 
    ? bodyValidation.data 
    : bodyValidation.data.suppliers;

  // Check for duplicate emails
  const emails = suppliers
    .map((supplier) => supplier.email)
    .filter((email): email is string => email !== undefined);

  if (emails.length > 0) {
    const existingSuppliers = await db.supplier.findMany({
      where: {
        email: {
          in: emails,
        },
      },
      select: {
        email: true,
      },
    });

    if (existingSuppliers.length > 0) {
      throw RouteError.BadRequest(
        `Emails already exist: ${existingSuppliers.map((s) => s.email).join(", ")}`
      );
    }
  }

  // Process products for each supplier
  const suppliersWithProducts = await Promise.all(
    suppliers.map(async (supplier) => {
      const { productIDs, ...supplierData } = supplier;
      const products =
        productIDs && productIDs.length > 0
          ? await db.product.findMany({
              where: {
                id: { in: productIDs },
              },
            })
          : [];

      return {
        ...supplierData,
        deliverableProducts: {
          connect: products,
        },
      };
    })
  );

  // Create all suppliers in a transaction
  const createdSuppliers = await db.$transaction(
    suppliersWithProducts.map((supplier) =>
      db.supplier.create({
        data: supplier,
        include: {
          deliverableProducts: true,
        },
      })
    )
  );

  return sendApiResponse({
    res,
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Suppliers created successfully",
    result: createdSuppliers,
  });
});
