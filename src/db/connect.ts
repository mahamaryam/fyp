import mongoose from 'mongoose';
import logger from 'utils/logger';
import { appEnv } from 'config/app-env';

import { green, red } from 'colorette';

export async function connect() {
  try {
    logger.info('Connecting to MongoDB ...');
    await mongoose.connect(appEnv.MONGO_URL ?? '');
    logger.info(green('Connected successfully to MongoDB instance'));
  } catch (error) {
    logger.error(red('Connection to MongoDB instance failed'));
    throw error;
  }
}
