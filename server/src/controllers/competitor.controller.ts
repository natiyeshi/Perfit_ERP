import { StatusCodes } from "http-status-codes";
import { asyncWrapper, RouteError, sendApiResponse } from "../utils";
import { queryValidator, competitorValidator } from "../validators";
import { db, zodErrorFmt } from "../libs";

export const getCompetitorsController = asyncWrapper(async (req, res) => {
  const paginationValiation =
    queryValidator.paginationsQueryValidator.safeParse(req.query);

  if (!paginationValiation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(paginationValiation.error)[0].message,
      zodErrorFmt(paginationValiation.error)
    );

  const competitors = await db.competitor.findMany({
    include: {
      competitorImports: true,
    },
    take: paginationValiation.data.limit,
    skip: (paginationValiation.data.page || 1) - 1 || undefined,
    orderBy: {
      name: 'asc', // Change 'name' to your desired sort field if needed
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Competitors retrieved successfully",
    result: competitors,
  });
});

export const getCompetitorByIDController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Competitor ID not provided or invalid.")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const competitor = await db.competitor.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
    include: {
      competitorImports: true,
    },
  });

  if (!competitor)
    throw RouteError.NotFound("Competitor not found with the provided ID.");

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Competitor retrieved successfully",
    result: competitor,
  });
});

export const createCompetitorController = asyncWrapper(async (req, res) => {
  const bodyValidation = competitorValidator.createCompetitorSchema.safeParse(
    req.body
  );

  if (!bodyValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );

  // Check if email already exists
  if (bodyValidation.data.email) {
    const existingCompetitor = await db.competitor.findUnique({
      where: { email: bodyValidation.data.email },
      select: { id: true },
    });
    if (existingCompetitor) {
      throw RouteError.BadRequest("Email already exists for another competitor.");
    }
  }

  const newCompetitor = await db.competitor.create({
    data: bodyValidation.data,
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Competitor created successfully",
    result: newCompetitor,
  });
});

export const updateCompetitorController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Competitor ID not provided or invalid.")
    .safeParse(req.params);
  const bodyValidation = competitorValidator.updateCompetitorSchema.safeParse(
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

  const existingCompetitor = await db.competitor.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
    include: {
      competitorImports: true,
    },
  });

  if (!existingCompetitor)
    throw RouteError.NotFound("Competitor not found with the provided ID.");

  const updatedCompetitor = await db.competitor.update({
    where: {
      id: queryParamValidation.data.id,
    },
    data: bodyValidation.data,
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Competitor updated successfully",
    result: updatedCompetitor,
  });
});

export const deleteCompetitorController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Competitor ID not provided or invalid.")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const existingCompetitor = await db.competitor.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  if (!existingCompetitor)
    throw RouteError.NotFound("Competitor not found with the provided ID.");

  await db.competitor.delete({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Competitor deleted successfully",
    result: null,
  });
});

export const createMultipleCompetitorsController = asyncWrapper(async (req, res) => {
  const bodyValidation = competitorValidator.createMultipleCompetitorsSchema.safeParse(
    req.body
  );

  if (!bodyValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );

  // Get the competitors array from either format
  const competitors = Array.isArray(bodyValidation.data) 
    ? bodyValidation.data 
    : bodyValidation.data.competitors;

  // Check for duplicate emails
  const emails = competitors
    .map((competitor) => competitor.email)
    .filter((email): email is string => email !== null && email !== undefined);

  if (emails.length > 0) {
    const existingCompetitors = await db.competitor.findMany({
      where: {
        email: {
          in: emails,
        },
      },
      select: {
        email: true,
      },
    });

    if (existingCompetitors.length > 0) {
      throw RouteError.BadRequest(
        `Emails already exist: ${existingCompetitors.map((c) => c.email).join(", ")}`
      );
    }
  }

  // Create all competitors in a transaction
  const createdCompetitors = await db.$transaction(
    competitors.map((competitor) =>
      db.competitor.create({
        data: competitor,
      })
    )
  );

  return sendApiResponse({
    res,
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Competitors created successfully",
    result: createdCompetitors,
  });
});
