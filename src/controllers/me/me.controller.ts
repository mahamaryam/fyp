import express from 'express';
import ah from 'express-async-handler';

import { reply } from 'controllers/app-reply';
import { requireAuthenticated } from 'middleware/authMiddleware';
import { UserModel } from 'db/models/user';

export const router = express.Router();

router.get(
  '/me',
  requireAuthenticated(),
  ah(async (req, res) => {
    const user = await UserModel.findById(req.user!._id)
    return reply(res, user);
  }),
);
