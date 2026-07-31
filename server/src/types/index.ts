export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  [key: string]: unknown;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  result: T | null;
  meta?: PaginationMeta;
};
