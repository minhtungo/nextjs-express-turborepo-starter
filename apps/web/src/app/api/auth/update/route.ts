import { updateTokens } from '@/features/auth/actions/session';
import { ApiResponse } from '@/lib/auth/api';
import { StatusCodes } from 'http-status-codes';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { accessToken, refreshToken } = body;

  if (!accessToken || !refreshToken)
    return Response.json(ApiResponse.failure('Provide Tokens', null, 401), { status: 401 });

  await updateTokens({ accessToken, refreshToken });

  return Response.json(ApiResponse.success('Updated tokens successfully', null, StatusCodes.OK), {
    status: StatusCodes.OK,
  });
}
