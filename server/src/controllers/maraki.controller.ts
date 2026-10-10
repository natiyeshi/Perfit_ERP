import { StatusCodes } from "http-status-codes";
import { asyncWrapper, sendApiResponse } from "../utils";
import { cache } from "../libs";
import axios, { type AxiosResponse } from "axios";

// The upstream Maraki service is slow and spiky (0.5–6s). Data is considered
// fresh for a minute; after that, for up to 30 more minutes, users get the
// cached copy instantly while one background request refreshes it
// (stale-while-revalidate). Only a cold start or 30+ idle minutes makes a user
// wait for Maraki. Failures are never cached.
const MARAKI_FRESH_MS = 60 * 1000;
const MARAKI_STALE_MS = 30 * 60 * 1000;
const MARAKI_TIMEOUT_MS = 15 * 1000;

/**
 * Get all IODMs with optional pagination and filters
 */
export const getDashboardInfo = asyncWrapper(async (req, res) => {
  try {
    const result = await cache.getOrSetCacheSWR("maraki:dashboard", MARAKI_FRESH_MS, MARAKI_STALE_MS, async () => {
      const response: AxiosResponse<{ Data: any[] }> = await axios.post(
        "http://webapp.et:5201/4447673/run/ListRunDashBoardItemsQuery",
        {
          "DashBoardId": "SALES_DASHBOARD2",
        },
        { timeout: MARAKI_TIMEOUT_MS }
      );
      return response.data?.Data ?? [];
    });
    return sendApiResponse({
      res,
      statusCode: StatusCodes.OK,
      success: true,
      message: "Dashboard data retrieved successfully.",
      result,
    });
  } catch (error: any) {
    if (error?.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error?.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error?.message);
    }
    console.log(error?.config);
    return sendApiResponse({
      res,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to retrieve dashboard data.",
      result: [],
    });
  }
});