import { env } from './env';
import { APP_CONSTANTS, AUTH_CONSTANTS, RATE_LIMIT_CONSTANTS, API_CONSTANTS } from './constants';

export class Config {
  get nodeEnv() {
    return env.NODE_ENV;
  }

  get isDevelopment() {
    return this.nodeEnv === 'development';
  }

  get isProduction() {
    return this.nodeEnv === 'production';
  }

  get server() {
    const apiUrl = env.API_URL;

    return {
      apiUrl,
      corsOrigin: env.WEB_URL,
    };
  }

  get database() {
    return {
      url: env.DATABASE_URL,
    };
  }

  get storage() {
    return {
      s3Bucket: env.S3_BUCKET,
      aws: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        region: env.AWS_REGION,
      },
    };
  }

  get redis() {
    return {
      url: env.REDIS_URL,
    };
  }

  get app() {
    return {
      ...APP_CONSTANTS,
    };
  }

  get rateLimit() {
    return RATE_LIMIT_CONSTANTS;
  }

  get auth() {
    return AUTH_CONSTANTS;
  }

  get api() {
    return API_CONSTANTS;
  }
}
