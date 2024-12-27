export type ApiResponse<T = void> = {
  success: boolean;
  message: string;
  statusCode: number;
} & (T extends void ? {} : { data: T });
