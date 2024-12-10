import mongoose from 'mongoose';
import { env } from './config';

const init = async function () {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(env.MONGO_URI);
};

export default init();
