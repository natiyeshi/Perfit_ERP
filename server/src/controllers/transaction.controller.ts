import { StatusCodes } from "http-status-codes";
import {
  asyncWrapper,
  filterByLastDays,
  RouteError,
  sendApiResponse,
} from "../utils";
import { db, zodErrorFmt } from "../libs";
import { transactionValidator, queryValidator } from "../validators";

// Get All Transactions
export const getTransactionsController = asyncWrapper(async (req, res) => {
  const queryValidation =
    transactionValidator.getTransactionsQuerySchema.safeParse(req.query);

  if (!queryValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryValidation.error)[0].message,
      zodErrorFmt(queryValidation.error)
    );

  const isPopulate = queryValidation.data.populate === "true";

  let transactions = await db.transaction.findMany({
    take: queryValidation.data.limit,
    skip: (queryValidation.data.page || 1) - 1 || undefined,
    include: {
      product: isPopulate,
      customer: isPopulate,
      salesPerson: isPopulate,
    },
  });

  if (queryValidation.success && queryValidation.data.days)
    transactions = filterByLastDays<(typeof transactions)[0]>(
      transactions,
      queryValidation.data.days
    );

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Transactions retrieved successfully.",
    result: transactions,
  });
});

// Get Transaction By ID
export const getTransactionByIDController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Transaction ID not provided or invalid.")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const transaction = await db.transaction.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
    include: {
      product: true,
      customer: true,
      salesPerson: true,
    },
  });

  if (!transaction)
    throw RouteError.NotFound("Transaction not found with the provided ID.");

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Transaction retrieved successfully.",
    result: transaction,
  });
});

// Create Transaction
export const createTransactionController = asyncWrapper(async (req, res) => {
  const bodyValidation = transactionValidator.createTransactionSchema.safeParse(
    req.body
  );

  if (!bodyValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );

  const newTransaction = await db.transaction.create({
    data: bodyValidation.data,
  });

  await db.inventory.update({
    where: { productId: bodyValidation.data.productId },
    data: {
      quantity: {
        decrement: bodyValidation.data.quantity,
      },
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Transaction created successfully.",
    result: newTransaction,
  });
});

// Update Transaction
export const updateTransactionController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Transaction ID not provided or invalid.")
    .safeParse(req.params);
  const bodyValidation = transactionValidator.updateTransactionSchema.safeParse(
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

  const existingTransaction = await db.transaction.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  if (!existingTransaction)
    throw RouteError.NotFound("Transaction not found with the provided ID.");

  const updatedTransaction = await db.transaction.update({
    where: {
      id: queryParamValidation.data.id,
    },
    data: bodyValidation.data,
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Transaction updated successfully.",
    result: updatedTransaction,
  });
});

// Delete Transaction
export const deleteTransactionController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Transaction ID not provided or invalid.")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const existingTransaction = await db.transaction.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  if (!existingTransaction)
    throw RouteError.NotFound("Transaction not found with the provided ID.");

  await db.transaction.delete({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Transaction deleted successfully.",
    result: null,
  });
});
