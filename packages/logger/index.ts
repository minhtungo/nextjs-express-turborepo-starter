import pino, { Logger } from 'pino';

export const logger: Logger =
  process.env.NODE_ENV === 'production'
    ? // JSON in production
      pino({ level: 'warn' })
    : // Pretty print in development
      pino({
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
        level: 'debug',
      });

// import pino from 'pino';

// const isProduction = process.env.NODE_ENV === 'production';

// const logger = pino({
//   level: isProduction ? 'info' : 'debug',
//   browser: {
//     asObject: true,
//     write: (o) => {
//       console.log(JSON.stringify(o));
//     },
//   },
//   // Configure for both environments without worker threads
//   transport: {
//     target: isProduction ? 'pino' : 'pino-pretty',
//     options: {
//       colorize: !isProduction,
//       translateTime: 'SYS:standard',
//       ignore: 'pid,hostname',
//     },
//   },
// });

// export default logger;
