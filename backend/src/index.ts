import database from '@app/database';
import server from '@app/server';

const start = async () => {
  await database;
  await server;
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
