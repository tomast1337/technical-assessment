<<<<<<< HEAD
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
=======
import '@app/database';
import '@app/server';
>>>>>>> 39916c9 (Moved the backend to the backend folder)
