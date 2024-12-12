import { APP_CONSTANTS, AUTH_CONSTANTS, RATE_LIMIT_CONSTANTS, API_CONSTANTS } from './constants';

class Config {
  get nodeEnv() {
    return process.env.NODE_ENV;
  }

  get isDevelopment() {
    return this.nodeEnv === 'development';
  }

  get isProduction() {
    return this.nodeEnv === 'production';
  }

  get server() {
    const url = process.env.SERVER_URL;

    return {
      url,
      corsOrigin: process.env.WEBAPP_URL,
    };
  }

  get database() {
    return {
      url: process.env.DATABASE_URL,
    };
  }

  get storage() {
    return {
      s3Bucket: process.env.S3_BUCKET,
      aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      },
    };
  }

  get redis() {
    return {
      url: process.env.REDIS_URL,
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

export const config = new Config();
