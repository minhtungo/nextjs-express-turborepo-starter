import { ApiResponse } from '@/lib/api/baseFetch';

export const handleApiResponse = async <T>(response: Response): Promise<T> => {
  try {
    const result = await response.json();
    return result;
  } catch (error) {
    return ApiResponse.failure('Server error', null, response.status) as T;
  }
};
