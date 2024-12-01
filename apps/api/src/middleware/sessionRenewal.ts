import { session } from '@repo/config';
import type { RequestHandler } from 'express';

const sessionRenewal: RequestHandler = (req, res, next) => {
  if (!req.session) {
    return next();
  }

  const now = Date.now();
  const expires = req.session.cookie.expires?.getTime() ?? 0;

  if (expires - now < session.renewThreshold) {
    req.session.touch();
  }

  next();
};

export default sessionRenewal;
