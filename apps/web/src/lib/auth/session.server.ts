import { env } from "@/lib/env";
import { cookies } from "next/headers";

export const getSessionToken = async () => {
  return (await cookies()).get(env.SESSION_COOKIE_NAME)?.value;
};

export const setSessionTokenCookie = async (token: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set(env.SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: env.SESSION_COOKIE_MAX_AGE / 1000,
    path: "/",
  });
};

export const deleteSessionTokenCookie = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(env.SESSION_COOKIE_NAME);
};
