import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { RegionModel } from '@app/models';

const mongod = new MongoMemoryReplSet({
  replSet: { count: 1, storageEngine: 'wiredTiger' },
});

/**
 * Connect to the in-memory database.
 */
export const connect = async () => {
  const uri = await mongod.getUri();
  await mongoose.connect(uri);
  await RegionModel.ensureIndexes();
};

/**
 * Drop database, close the connection and stop mongod.
 */
export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

/**
 * Remove all the data for all db collections.
 */
export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
