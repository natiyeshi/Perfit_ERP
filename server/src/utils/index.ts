import asyncWrapper from "./async-wrapper";
import RouteError from "./errors";
import fsUtils from "./fs-utils";
import sendApiResponse from "./send-Api-response";

type HasCreatedAt = { createdAt: Date };
function filterByLastDays<T extends HasCreatedAt>(
  data: T[],
  days: number
): T[] {
  if (days <= 0) throw new Error("Days must be greater than zero.");

  const now = new Date();
  const thresholdDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  return data.filter((item) => item.createdAt >= thresholdDate);
}

export { asyncWrapper, RouteError, fsUtils, sendApiResponse, filterByLastDays };
