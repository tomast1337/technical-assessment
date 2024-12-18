import cookieParser from 'cookie-parser';
import express, { Router, json } from 'express';
import { StatusCodes } from 'http-status-codes';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';

import { env } from '@config/index';
import { authRouter } from '@controllers/auth.controller';
import { regionActionsRouter } from '@controllers/region-actions.controller';
import { regionRouter } from '@controllers/region.controller';
import { userRouter } from '@controllers/user.controller';

import passport from './auth/passaport';
import logger from './logger';
import { swaggerConfig } from './swaggerConfig';

const boostrap = async () => {
  const loggerLocal = logger.child({ label: 'app' });
  loggerLocal.info('Starting server...');

  const app = express();
  const router = Router();
  const port = env.PORT;

  const specs = swaggerJsdoc(swaggerConfig);

  app.use(
    morgan('combined', {
      stream: {
        write: (message) =>
          logger
            .child({
              label: 'http',
            })
            .info(message.trim()),
      },
    }),
  );

  app.use(cookieParser());

  app.use(
    json({
      limit: '50mb',
    }),
  );

  app.use(passport.initialize());
  app.use('/api', router);

  router.use('/auth', authRouter);

  router.use('/user', userRouter);

  router.use('/region', regionRouter);

  router.use('/region-actions', regionActionsRouter);

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      swaggerOptions: {
        persistAuthorization: true,
      },
    }),
  );

  app.use((req, res, _next) => {
    res.status(StatusCodes.NOT_FOUND).json({ message: 'Not Found' });
  });

  app.listen(port, () => {
    loggerLocal.info(`Server is running on http://localhost:${port}`);

    loggerLocal.debug(
      `API documentation is running on http://localhost:${port}/api-docs`,
    );
  });

  return app;
};

export default boostrap();
