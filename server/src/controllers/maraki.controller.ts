import { StatusCodes } from "http-status-codes";
import { asyncWrapper, sendApiResponse } from "../utils";
import { cache } from "../libs";
import axios, { type AxiosResponse } from "axios";

// The upstream Maraki service is slow and spiky (p95 ~1.7s). Successful
// responses are reused for a minute; failures are never cached.
const MARAKI_TTL_MS = 60 * 1000;
const MARAKI_TIMEOUT_MS = 15 * 1000;

/**
 * Get all IODMs with optional pagination and filters
 */
export const getDashboardInfo = asyncWrapper(async (req, res) => {
  try {
    const result = await cache.getOrSetCache("maraki:dashboard", MARAKI_TTL_MS, async () => {
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