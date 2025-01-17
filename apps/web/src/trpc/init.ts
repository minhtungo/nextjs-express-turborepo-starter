import { appRouter } from '@api/router';
import 'server-only';
import { createCallerFactory } from '@trpc/server/dist/core/internals/createCallerFactory';
const createCaller = createCallerFactory(appRouter);
