import * as express from 'express';
import { env } from '@config/index';
import passport from './auth/passaport';
import { authRouter } from '@controllers/auth.controller';
import { userRouter } from '@controllers/user.controller';
import { regionRouter } from '@controllers/region.controller';
import * as swaggerUi from 'swagger-ui-express';
import { swaggerConfig } from './swaggerConfig'; // Adjust the path as necessary
import swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const router = express.Router();
const port = env.PORT;

const specs = swaggerJsdoc(swaggerConfig);

app.use(express.json());
app.use(passport.initialize());
app.use('/api', router);

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/region', regionRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

router.use('/', (req, res) => {
  res.send('Welcome to the API');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(
    `API documentation is running on http://localhost:${port}/api-docs`,
  );
});

export default app;
