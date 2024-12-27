import * as z from "zod";

/**
 * model Product {
  id        String @id @unique @default(cuid())
  name      String @unique
  shelfLife Int    @map("shelf_life")
  brand     String
  unit      String

  inventories       Inventory[]
  IDOMs             IODM[]
  pipelines         Pipeline[]
  transactions      Transaction[]
  competitorImports CompetitorImport[]

  @@map("products")
}
 */

export const createProductSchema = z.object({
  name: z
    .string({ message: "Product name must be a string." })
    .min(1, { message: "Product name is required." }),
  shelfLife: z
    .number({
      message: "Product life must be a number",
    })
    .positive(),
  brand: z.string({ message: "Brand must be a string." }).min(1, {
    message: "Brand for product is required.",
  }),
  unit: z
    .string({
      message: "Product unit must be a string",
    })
    .min(1, {
      message: "Product unit is required.",
    }),
});

export const updateProductSchema = createProductSchema.partial();
