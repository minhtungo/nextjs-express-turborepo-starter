import { afterLoginUrl } from '@/config';
import { env } from '@/config/env';
import { createSession } from '@/features/auth/actions/session';
import { ApiResponse } from '@/lib/auth/api';
import { StatusCodes } from 'http-status-codes';
import { redirect } from 'next/navigation';
import { type NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const accessToken = searchParams.get('accessToken');
  const refreshToken = searchParams.get('refreshToken');
  const userId = searchParams.get('userId');
  const email = searchParams.get('email');

  if (!accessToken || !refreshToken || !userId || !email) {
    return Response.json(ApiResponse.failure('Failed to authenticate with Google', null, StatusCodes.BAD_REQUEST), {
      status: StatusCodes.BAD_REQUEST,
      statusText: 'Bad Request',
    });
  }

  await createSession({
    user: {
      id: userId,
      email: email,
    },
    accessToken,
    refreshToken,
  });

  redirect(`${env.NEXT_PUBLIC_BASE_URL}${afterLoginUrl}`);
}
