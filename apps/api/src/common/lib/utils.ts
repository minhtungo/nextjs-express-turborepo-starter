import { logger } from '@repo/logger';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { StatusCodes } from 'http-status-codes';

export const handleServiceError = (error: Error, operation: string) => {
  const message = `Error during ${operation.toLowerCase()}: ${error.message}`;
  logger.error(message);
  return ServiceResponse.failure(
    `An error occurred during ${operation.toLowerCase()}.`,
    null,
    StatusCodes.INTERNAL_SERVER_ERROR
  );
};
