import { StatusCodes } from "http-status-codes";
import { asyncWrapper, RouteError, sendApiResponse } from "../utils";
import { db, zodErrorFmt } from "../libs";
import { customerValidator, queryValidator } from "../validators";

export const getCustomersController = asyncWrapper(async (req, res) => {
  const customers = await db.customer.findMany({
    include: {
      transactions: true,
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Customers retrieved successfully.",
    result: customers,
  });
});

export const getCustomerByIDController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Customer ID not provided or invalid.")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const customer = await db.customer.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
    include: {
      transactions: true,
    },
  });

  if (!customer)
    throw RouteError.NotFound("Customer not found with the provided ID.");

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Customer retrieved successfully.",
    result: customer,
  });
});

export const createCustomerController = asyncWrapper(async (req, res) => {
  const bodyValidation = customerValidator.createCustomerSchema.safeParse(
    req.body
  );

  if (!bodyValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );

  const newCustomer = await db.customer.create({
    data: bodyValidation.data,
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Customer created successfully.",
    result: newCustomer,
  });
});

export const updateCustomerController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Customer ID not provided or invalid.")
    .safeParse(req.params);
  const bodyValidation = customerValidator.updateCustomerSchema.safeParse(
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

  const existingCustomer = await db.customer.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
    include: {
      transactions: true,
    },
  });

  if (!existingCustomer)
    throw RouteError.NotFound("Customer not found with the provided ID.");

  const updatedCustomer = await db.customer.update({
    where: {
      id: queryParamValidation.data.id,
    },
    data: bodyValidation.data,
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Customer updated successfully.",
    result: updatedCustomer,
  });
});

export const deleteCustomerController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Customer ID not provided or invalid.")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const existingCustomer = await db.customer.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
    include: {
      transactions: true,
    },
  });

  if (!existingCustomer)
    throw RouteError.NotFound("Customer not found with the provided ID.");

  await db.customer.delete({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Customer deleted successfully.",
    result: null,
  });
});
