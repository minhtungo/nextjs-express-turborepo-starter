import dotenv from "dotenv";
import { cleanEnv, host, num, port, str, testOnly } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly("test"),
    choices: ["development", "production", "test"],
  }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  APP_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  GOOGLE_CLIENT_ID: str(),
  GOOGLE_CLIENT_SECRET: str(),
  GOOGLE_CALLBACK_URL: str(),
  // Email configuration
  MAILGUN_API_KEY: str(),
  MAILGUN_DOMAIN: str(),
  EMAIL_FROM: str(),
  EMAIL_SERVER_HOST: str(),
  EMAIL_SERVER_USER: str(),
  EMAIL_SERVER_PASSWORD: str(),
  EMAIL_SERVER_PORT: num(),
  EMAIL_SERVER_HTTP_PORT: num(),
  // Session configuration
  SESSION_SECRET: str(),
  SESSION_COOKIE_NAME: str(),
  SESSION_COOKIE_MAX_AGE: num(),
});
