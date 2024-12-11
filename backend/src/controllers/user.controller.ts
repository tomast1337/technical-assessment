import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import passport from 'passport';

import {
  validationBodyMiddleware,
  validationQueryMiddleware,
} from '@middlewares/validationMiddleware';
import { User } from '@models/user.model';
import UserService from '@services/user.service';
import { PagingDto } from '@views/Paging.dto';
import { UpdateUserDto } from '@views/UpdateUser.dto';

const { deleteUser, getUserById, getUsers, updateUser } = UserService;

export const userRouter = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Get the current user's information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The current user's information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 address:
 *                   type: string
 *                 coordinates:
 *                   type: array
 *                   items:
 *                     type: number
 *       400:
 *         description: Bad request
 */
userRouter.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    const user = req.user as User;
    const id = user._id;

    try {
      const foundUser = await getUserById(user, id);
      res.status(StatusCodes.OK).json(foundUser);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  },
);

/**
 * @swagger
 * /api/user/me:
 *   patch:
 *     summary: Update the current user's information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 */
userRouter.patch(
  '/me',
  passport.authenticate('jwt', { session: false }),
  validationBodyMiddleware(UpdateUserDto),
  async (req: Request, res: Response) => {
    const user = req.user as User;
    const id = user._id;
    const body = req.body as UpdateUserDto;

    try {
      const updatedUser = await updateUser(user, id, body);
      res.status(StatusCodes.OK).json(updatedUser);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  },
);

/**
 * @swagger
 * /api/user/me:
 *   delete:
 *     summary: Delete the current user's account
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Bad request
 */
userRouter.delete(
  '/me',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    const user = req.user as User;
    const id = user._id;

    try {
      await deleteUser(user, id);
      res.status(StatusCodes.OK).json({ message: 'User deleted successfully' });
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  },
);

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get a list of users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Number of items per page
 *       - in: query
 *         name: shortBy
 *         schema:
 *           type: string
 *         required: false
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Sort order (true for ascending, false for descending)
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   address:
 *                     type: string
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *       400:
 *         description: Bad request
 */
userRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  validationQueryMiddleware(PagingDto),
  async (req: Request, res: Response) => {
    const query = req.query as unknown as PagingDto;

    try {
      const users = await getUsers(query);
      res.status(StatusCodes.OK).json(users);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  },
);
