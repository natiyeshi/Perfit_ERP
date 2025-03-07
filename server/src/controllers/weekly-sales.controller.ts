import { StatusCodes } from "http-status-codes";
import {
  asyncWrapper,
  filterByLastDays,
  RouteError,
  sendApiResponse,
} from "../utils";
import { db, zodErrorFmt } from "../libs";
import { weeklySalesValidator, queryValidator } from "../validators";

function getLastMonday() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const lastMonday = new Date(today);

  // If today is Monday (1), go back 7 days; otherwise, go back to the previous Monday
  const daysToLastMonday =
    dayOfWeek === 1 ? 0 : dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  lastMonday.setDate(today.getDate() - daysToLastMonday);

  // Set the time to 00:00:00 to get the date only
  lastMonday.setHours(0, 0, 0, 0);

  return lastMonday;
}

export const getWeeklySalesController = asyncWrapper(async (req, res) => {
  const queryValidation =
    weeklySalesValidator.getWeeklySalesQuerySchema.safeParse(req.query);

  if (!queryValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryValidation.error)[0].message,
      zodErrorFmt(queryValidation.error)
    );

    if (!req.user) {
      throw RouteError.Unauthorized("User not authenticated.");
    }

    let weeklySales = await db.weeklySales.findMany({
      take: queryValidation.data.limit,
      skip: (queryValidation.data.page || 1) - 1 || undefined,
      where: {
          salesPersonId: {
              equals: req.user._id,
          }
      },
      include: {
          salesPerson: {
              include: {
                  user: true  // ✅ This will fetch the user linked to salesPerson
              }
          }
      }
  });
  

  if (queryValidation.success && queryValidation.data.days)
    weeklySales = filterByLastDays<(typeof weeklySales)[0]>(
      weeklySales,
      queryValidation.data.days
    );

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Weekly sales retrieved successfully.",
    result: weeklySales,
  });
});

export const getAllWeeklySalesController = asyncWrapper(async (req, res) => {
  const queryValidation =
    weeklySalesValidator.getWeeklySalesQuerySchema.safeParse(req.query);

  if (!queryValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryValidation.error)[0].message,
      zodErrorFmt(queryValidation.error)
    );

    if (!req.user) {
      throw RouteError.Unauthorized("User not authenticated.");
    }

    let weeklySales = await db.weeklySales.findMany({
      take: queryValidation.data.limit,
      skip: (queryValidation.data.page || 1) - 1 || undefined,
      where : {
        startDate : getLastMonday()
      },
      include: {
          salesPerson: {
              include: {
                  user: true  // ✅ This will fetch the user linked to salesPerson
              }
          }
      }
  });
  

  if (queryValidation.success && queryValidation.data.days)
    weeklySales = filterByLastDays<(typeof weeklySales)[0]>(
      weeklySales,
      queryValidation.data.days
    );

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Weekly sales retrieved successfully.",
    result: weeklySales,
  });
});


export const getThisWeakSalesController = asyncWrapper(async (req, res) => {
  const queryValidation =
    weeklySalesValidator.getWeeklySalesQuerySchema.safeParse(req.query);

  if (!queryValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryValidation.error)[0].message,
      zodErrorFmt(queryValidation.error)
    );

    if (!req.user) {
      throw RouteError.Unauthorized("User not authenticated.");
    }
    

  let weeklySales = await db.weeklySales.findFirst({
    take: queryValidation.data.limit,
    skip: (queryValidation.data.page || 1) - 1 || undefined,
    where:{
      startDate: {
        equals: getLastMonday(),
      },
      salesPersonId : {
        equals : req.user._id,
      },
    }
  });

  // if (queryValidation.success && queryValidation.data.days)
  //   weeklySales = filterByLastDays<(typeof weeklySales)[0]>(
  //     weeklySales,
  //     queryValidation.data.days
  //   );

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Weekly sales retrieved successfully.",
    result: weeklySales,
  });
});

export const getWeeklySaleByIDController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Weekly Sale ID not provided or invalid.")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const existingSale = await db.weeklySales.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  if (!existingSale)
    throw RouteError.NotFound("Weekly Sale not found with the provided ID.");

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Weekly sale retrieved successfully.",
    result: existingSale,
  });
});


export const getWeeklySaleBySalesIdController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Sales ID not provided or invalid.")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const existingSale = await db.weeklySales.findMany({
    where: {
      salesPersonId: queryParamValidation.data.id,
    },
    include : {
      salesPerson : {
        include : {
          user : true
        }
      }
    }
  });

  if (!existingSale)
    throw RouteError.NotFound("Weekly Sale not found with the provided ID.");

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Weekly sale retrieved successfully.",
    result: existingSale,
  });
});

export const createWeeklySaleController = asyncWrapper(async (req, res) => {
  const bodyValidation = weeklySalesValidator.createWeeklySalesSchema.safeParse(
    req.body
  );

  if (!bodyValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );
  
  if (!req.user) {
    throw RouteError.Unauthorized("User not authenticated.");
  }

  const newData = {
    ...bodyValidation.data,
    salesPersonId: req.user._id,
    startDate : getLastMonday(),
    endDate : new Date(getLastMonday().setDate(getLastMonday().getDate() + 6))
  };

  const newSale = await db.weeklySales.create({
    data: newData,
    
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Weekly sale created successfully.",
    result: newSale,
  });
});

export const updateWeeklySaleController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Weekly Sale ID not provided or invalid.")
    .safeParse(req.params);
  const bodyValidation = weeklySalesValidator.updateWeeklySalesSchema.safeParse(
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

  const updatedSale = await db.weeklySales.update({
    where: {
      id: queryParamValidation.data.id,
    },
    data: bodyValidation.data,
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Weekly sale updated successfully.",
    result: updatedSale,
  });
});

export const deleteWeeklySaleController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryValidator
    .queryParamIDValidator("Weekly Sale ID not provided or invalid.")
    .safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const existingSale = await db.weeklySales.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  if (!existingSale)
    throw RouteError.NotFound("Weekly Sale not found with the provided ID.");

  await db.weeklySales.delete({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Weekly sale deleted successfully.",
    result: null,
  });
});
