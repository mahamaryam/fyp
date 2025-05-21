import express from 'express';
import ah from 'express-async-handler';
import { reply } from 'controllers/app-reply';

export const router = express.Router();

router.get(
  '/health',
  ah(async (req, res) => {
    return reply(res, {
      live: true,
      query: req.query
    });
  }),
);
