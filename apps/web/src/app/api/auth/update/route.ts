import { StatusCodes } from 'http-status-codes';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { accessToken, refreshToken } = body;

  if (!accessToken || !refreshToken)
    return Response.json(
      {
        success: false,
        message: 'Provide Tokens',
        statusCode: 401,
      },
      { status: 401 }
    );
  // await updateTokens({ accessToken, refreshToken });

  return Response.json(
    {
      success: true,
      message: 'Updated tokens successfully',
      statusCode: 200,
    },
    {
      status: StatusCodes.OK,
    }
  );
}
