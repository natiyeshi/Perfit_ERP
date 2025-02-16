import * as z from "zod";
import {
  lastDaysQueryValidator,
  paginationsQueryValidator,
} from "./query.validator";

export const createWeeklySalesSchema = z.object({
  targetSales: z
    .number({ message: "Target sales must be a number." })
    .int({ message: "Target sales must be an integer." })
    .nonnegative({ message: "Target sales must be zero or greater." }),

  plannedContacts: z
    .number({ message: "Planned contacts must be a number." })
    .int({ message: "Planned contacts must be an integer." })
    .nonnegative({ message: "Planned contacts must be zero or greater." }),

  plannedVisits: z
    .number({ message: "Planned visits must be a number." })
    .int({ message: "Planned visits must be an integer." })
    .nonnegative({ message: "Planned visits must be zero or greater." }),

  plannedNewCustomers: z
    .number({ message: "Planned new customers must be a number." })
    .int({ message: "Planned new customers must be an integer." })
    .nonnegative({ message: "Planned new customers must be zero or greater." }),

  plannedTransactions: z
    .number({ message: "Planned transactions must be a number." })
    .int({ message: "Planned transactions must be an integer." })
    .nonnegative({ message: "Planned transactions must be zero or greater." }),

  startDate: z.coerce.date({ message: "Start date must be a valid date." }),

  endDate: z.coerce.date({ message: "End date must be a valid date." }),

  salesPersonId: z
    .string({ message: "Sales person ID must be a string." })
    .min(1, { message: "Sales person ID is required." }),
});

export const updateWeeklySalesSchema = createWeeklySalesSchema
  .partial()
  .extend({
    actualContacts: z
      .number({ message: "Actual contacts must be a number." })
      .int({ message: "Actual contacts must be an integer." })
      .nonnegative({ message: "Actual contacts must be zero or greater." })
      .optional(),

    actualVisits: z
      .number({ message: "Actual visits must be a number." })
      .int({ message: "Actual visits must be an integer." })
      .nonnegative({ message: "Actual visits must be zero or greater." })
      .optional(),

    actualNewCustomers: z
      .number({ message: "Actual new customers must be a number." })
      .int({ message: "Actual new customers must be an integer." })
      .nonnegative({ message: "Actual new customers must be zero or greater." })
      .optional(),

    actualTransactions: z
      .number({ message: "Actual transactions must be a number." })
      .int({ message: "Actual transactions must be an integer." })
      .nonnegative({ message: "Actual transactions must be zero or greater." })
      .optional(),
  });

export const getWeeklySalesQuerySchema = paginationsQueryValidator
  .extend(lastDaysQueryValidator.shape)
  .extend({
    populate: z
      .enum(["true", "false"], {
        message: "Populate must be a boolean.",
      })
      .optional(),
  });
