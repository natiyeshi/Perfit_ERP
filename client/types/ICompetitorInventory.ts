export interface CreateCompetitorInventory {
    sellingPrice: number; // Must be a positive number
    productId: string;    // Must be a non-empty string
    competitorId: string; // Must be a non-empty string
}
  