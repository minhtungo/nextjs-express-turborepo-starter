import { updateTokens } from '@/lib/auth/auth';
import { ApiResponse } from '@/lib/api/baseFetch';
import { StatusCodes } from 'http-status-codes';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { accessToken, refreshToken } = body;

  if (!accessToken || !refreshToken)
    return Response.json(ApiResponse.failure('Provide Tokens', null, 401), { status: 401 });
  console.log('hereee', body);
  await updateTokens({ accessToken, refreshToken });

  return Response.json(ApiResponse.success('Updated tokens successfully', null, StatusCodes.OK), {
    status: StatusCodes.OK,
  });
}
