import express from 'express';
import ah from 'express-async-handler';
import { ApplicationError } from 'controllers/errors';

import { UserModel } from 'db/models/user';
import { AccessTokenClaims } from 'middleware/AccessTokenClaims';
import jwt from 'jsonwebtoken';
import { appEnv } from 'config/app-env';

import { comparePassword, hashPassword } from './hashing';
import { reply } from 'controllers/app-reply';
import joi from 'joi';
import { customJoi, validateJoi } from 'middleware/validateJoi';

export const router = express.Router();

function createToken(user: any) {
  return new Promise<string>((resolve, reject) =>
    jwt.sign(
      { uid: user._id.toString() } satisfies AccessTokenClaims,
      appEnv.JWT_SIGNING_KEY || '',
      (err: any, token: string) => {
        if (err) reject(err);
        else resolve(token);
      },
    ),
  );
}

router.post(
  '/auth/login',
  validateJoi(
    joi.object({
      email: joi.string().required(),
      password: joi.string().required(),
    }),
  ),
  ah(async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (
      user == null ||
      !(await comparePassword(password, user.passwordHash || ''))
    ) {
      throw new ApplicationError('Invalid email or password', 401);
    }

    let token = await createToken(user);

    return reply(res, { token, user });
  }),
);


router.post(
  '/auth/sign-up',
  validateJoi(
    joi.object({
      email: joi.string().required(),
      password: joi.string().required(),

      fullName: joi.string().required(),
      bio: customJoi.optionalString(),
      gender: customJoi.optionalString(),
      dateOfBirth: joi.date(),

      addressCountry: customJoi.optionalString(),
      addressCity: customJoi.optionalString(),
      addressArea: customJoi.optionalString(),
      addressZip: customJoi.optionalString(),
    }),
  ),
  ah(async (req, res) => {
    const { email, password, role, ...restData } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) throw new ApplicationError('Email already registered');

    const passwordHash = await hashPassword(password);

    let user = new UserModel({
      ...restData,
      email,
      passwordHash,
      role,
    });

    user = await user.save();
    const token = await createToken(user);

    return reply(res, { token, user });
  }),
);
