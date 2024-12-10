import mongoose from 'mongoose';

import { env } from './config';
import logger from './logger';
import { RegionModel } from './models';

const loggerLocal = logger.child({ label: 'database' });

const init = async function () {
  try {
    loggerLocal.info(`Connecting to database: ${env.MONGO_URI}`);
    await mongoose.connect(env.MONGO_URI);
    mongoose.set('debug', env.NODE_ENV === 'development');
    loggerLocal.info('Database connected');

    await RegionModel.ensureIndexes();
  } catch (error) {
    loggerLocal.error('Database connection failed');
  }
};

export default init();
