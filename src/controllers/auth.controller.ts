import { Request, Response, Router } from 'express';
import {
  loginUser,
  registerUser,
  me,
  updatePassword,
} from 'src/services/auth.service';

import { validationMiddleware } from '@middlewares/validationMiddleware';
import {
  LoginUserDto,
  RegisterUserDto,
  UpdatePasswordDto,
} from '@views/auth.dto';

import {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} from 'http-status-codes';

export const authRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 */
authRouter.post(
  '/register',
  validationMiddleware(RegisterUserDto),
  async (req: Request, res: Response) => {
    const { name, email, password, address } = req.body;

    try {
      const result = await registerUser({ name, email, password, address });
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  },
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 */
authRouter.post(
  '/login',
  validationMiddleware(LoginUserDto),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const result = await loginUser({ email, password });
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  },
);

/**
 * @swagger
 * /api/auth/me:
 *  get:
 *   summary: Get the current user
 *  tags: [Auth]
 * security:
 *  - bearerAuth: []
 *
 *  responses:
 *   200:
 *   description: The current user
 *  content:
 *  application/json:
 *  schema:
 *  type: object
 */
authRouter.get('/me', async (req: Request, res: Response) => {
  const { id } = req.user as any; // TODO: Fix this any
  try {
    const result = await me(id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
});

authRouter.put(
  '/updatePassword',
  validationMiddleware(UpdatePasswordDto),
  async (req: Request, res: Response) => {
    const { password } = req.body;
    const { id } = req.user as any; // TODO: Fix this any
    try {
      const result = await updatePassword(id, password);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  },
);
