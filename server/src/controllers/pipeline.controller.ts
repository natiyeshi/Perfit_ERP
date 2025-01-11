import { StatusCodes } from "http-status-codes";
import {
  asyncWrapper,
  filterByLastDays,
  RouteError,
  sendApiResponse,
} from "../utils";
import { db, zodErrorFmt } from "../libs";
import { pipelineValidator, queryValidator } from "../validators";

export const getPipelinesController = asyncWrapper(async (req, res) => {
  const queryValidation = pipelineValidator.getPipelinesQuerySchema.safeParse(
    req.query
  );

  if (!queryValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryValidation.error)[0].message,
      zodErrorFmt(queryValidation.error)
    );

  const isPopulate = queryValidation.data.populate === "true";

  let pipelines = await db.pipeline.findMany({
    take: queryValidation.data.limit,
    skip: (queryValidation.data.page || 1) - 1 || undefined,
    include: {
      product: isPopulate,
    },
  });

  if (queryValidation.success && queryValidation.data.days)
    pipelines = filterByLastDays<(typeof pipelines)[0]>(
      pipelines,
      queryValidation.data.days
    );

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Pipelines retrieved successfully.",
    result: pipelines,
  });
});

export const getPipelineByIDController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Pipeline ID not provided or invalid.")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const existingPipeline = await db.pipeline.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
    include: {
      product: true,
    },
  });

  if (!existingPipeline)
    throw RouteError.NotFound("Pipeline not found with the provided ID.");

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Pipeline retrieved successfully.",
    result: existingPipeline,
  });
});

export const createPipelineController = asyncWrapper(async (req, res) => {
  const bodyValidation = pipelineValidator.createPipelineSchema.safeParse(
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
    throw RouteError.NotFound(
      "Product not found with the provided product ID."
    );

  const newPipeline = await db.pipeline.create({
    data: bodyValidation.data,
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Pipeline created successfully.",
    result: newPipeline,
  });
});

export const updatePipelineController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Pipeline ID not provided or invalid.")
    .safeParse(req.params);
  const bodyValidation = pipelineValidator.updatePipelineSchema.safeParse(
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

  const existingPipeline = await db.pipeline.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  if (!existingPipeline)
    throw RouteError.NotFound("Pipeline not found with the provided ID.");

  const updatedPipeline = await db.pipeline.update({
    where: {
      id: queryParamValidation.data.id,
    },
    data: bodyValidation.data,
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Pipeline updated successfully.",
    result: updatedPipeline,
  });
});

export const deletePipelineController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Pipeline ID not provided or invalid.")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const existingPipeline = await db.pipeline.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  if (!existingPipeline)
    throw RouteError.NotFound("Pipeline not found with the provided ID.");

  await db.pipeline.delete({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Pipeline deleted successfully.",
    result: null,
  });
});
