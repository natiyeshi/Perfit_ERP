import { StatusCodes } from "http-status-codes";
import { asyncWrapper, RouteError, sendApiResponse } from "../utils";
import { productValidator, queryValidator } from "../validators";
import { db, zodErrorFmt } from "../libs";

export const getSalesPersonsDataController = asyncWrapper(async (req, res) => {
  const paginationValiation =
    queryValidator.paginationsQueryValidator.safeParse(req.query);

  if (!paginationValiation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(paginationValiation.error)[0].message,
      zodErrorFmt(paginationValiation.error)
    );

  const salsePersonData = await db.salesPerson.findMany({
    take: paginationValiation.data.limit,
    skip: (paginationValiation.data.page || 1) - 1 || undefined,
    include : {
      user : true,
    }
  });
  const transactionCounts = await db.transaction.groupBy({
    by: ["salesPersonId"],
    _count: {
      id: true,
    },
  });

  // Attach transaction count to each salesPerson
  const salesPersonWithTransactionCount = salsePersonData.map((salesPerson) => {
    const countEntry = transactionCounts.find(tc => tc.salesPersonId === salesPerson.userId);
    return {
      ...salesPerson,
      transactionCount: countEntry?._count?.id || 0,
    };
  });

  // Total transactions count
  const totalTransactions = transactionCounts.reduce((sum, tc) => sum + tc._count.id, 0);

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "salsePersonData retrieved successfully",
    result: {
      totalTransactions,
      salsePersonData: salesPersonWithTransactionCount,
    },
  });
});