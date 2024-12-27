import { getCookie } from "cookies-next";
import { env } from "../env";

export const getClientSessionToken = () => {
  return getCookie(env.SESSION_COOKIE_NAME);
};
