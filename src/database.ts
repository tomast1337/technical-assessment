import mongoose from 'mongoose';

import { env } from './config';
import logger from './logger';

const loggerLocal = logger.child({ label: 'database' });

const init = async function () {
  try {
    await mongoose.connect(env.MONGO_URI);
    mongoose.set('debug', env.NODE_ENV === 'development');
    loggerLocal.info('Database connected');
  } catch (error) {
    loggerLocal.error('Database connection failed');
  }
};

export default init();
