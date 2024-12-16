import * as z from "zod";

import * as authValidator from "./auth.validator";

import * as productValidator from "./product.validator";

import * as userValidator from "./user.validator";

const queryParamIDValidator = (
  message = "Query param ID not provided or invalid."
) => {
  return z.object({
    id: z
      .string({
        message,
      })
      .min(1, { message }),
  });
};

export {
  queryParamIDValidator,
  authValidator,
  productValidator,
  userValidator,
};
