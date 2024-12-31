import pino from "pino";

export const logger = pino({ name: "server start", redact: ["DATABASE_URL"] });
