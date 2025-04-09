import express from 'express';

import { router as healthRouter } from 'controllers/health.controller';
import { router as authRouter } from 'controllers/auth/auth.controller';
import { router as meRouter } from 'controllers/me/me.controller';
import { router as venueRouter } from 'controllers/venue/venue.controller';

export function createRootRouter() {
  const router = express.Router();

  router.use(healthRouter);
  router.use(authRouter);
  router.use(meRouter);
  router.use(venueRouter);

  return router;
}
