import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import passport = require('passport');

import { validationBodyMiddleware } from '@middlewares/validationMiddleware';
import AuthService, { DecodedTokenT } from '@services/auth.service';
import { LoginUserDto } from '@views/LoginUser.dto';
import { RegisterUserDto } from '@views/RegisterUser.dto';
import { UpdatePasswordDto } from '@views/UpdatePassword.dto';

const { RefreshToken, loginUser, registerUser, updatePassword } = AuthService;

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
  validationBodyMiddleware(RegisterUserDto),
  async (req: Request, res: Response) => {
    const { name, email, password, address, coordinates } = req.body;

    try {
      const result = await registerUser({
        name,
        email,
        password,
        address,
        coordinates,
      });

      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: (error as Error).message });
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
  validationBodyMiddleware(LoginUserDto),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const result = await loginUser({ email, password });
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  },
);

/**
 * @swagger
 * /api/auth/update-password:
 *   patch:
 *     summary: Update the user's password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Bad request
 */
authRouter.patch(
  '/update-password',
  passport.authenticate('jwt', { session: false }),
  validationBodyMiddleware(UpdatePasswordDto),
  async (req: Request, res: Response) => {
    const { password } = req.body;
    const { id } = req.user as DecodedTokenT;

    try {
      const result = await updatePassword(id, password);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  },
);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh the user's token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       400:
 *         description: Bad request
 */
authRouter.post('/refresh-token', async (req: Request, res: Response) => {
  const refreshToken = req.cookies['refresh-token'];

  if (!refreshToken) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Refresh token cookie not found' });
  }

  try {
    const result = await RefreshToken(refreshToken);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: (error as Error).message });
  }
});
