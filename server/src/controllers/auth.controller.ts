import { ApiResponse } from "../types";
import { asyncWrapper } from "../utils";

export const signUpController = asyncWrapper(async (_, res) => {
  res.status(200).json({
    success: true,
    message: "User signed up successfully",
    result: null,
  } satisfies ApiResponse<null>);
});

export const signInController = asyncWrapper(async (_, res) => {
  res.status(200).json({
    success: true,
    message: "User signed in successfully",
    result: null,
  } satisfies ApiResponse<null>);
});
