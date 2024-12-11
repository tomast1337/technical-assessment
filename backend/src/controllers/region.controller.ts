import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import passport from 'passport';

import { PagingDto } from '@app/views/Paging.dto';
import {
  validationBodyMiddleware,
  validationQueryMiddleware,
} from '@middlewares/validationMiddleware';
import RegionService from '@services/region.service';
import { RegionDto } from '@views/Region.dto';
import logger from '@app/logger';

const { createRegion, getRegionById, updateRegion, deleteRegion, getRegions } =
  RegionService;

export const regionRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Region
 *   description: Region management endpoints
 */

/**
 * @swagger
 * /api/region:
 *   post:
 *     summary: Create a new region
 *     tags: [Region]
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
 *               geometry:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [Polygon]
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: array
 *                       items:
 *                         type: array
 *                         items:
 *                           type: number
 *     responses:
 *       201:
 *         description: Region created successfully
 *       400:
 *         description: Bad request
 */
regionRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  validationBodyMiddleware(RegionDto),
  async (req: Request, res: Response) => {
    console.log('Creating region sdasda:', req.body);
    const user = req.user as { _id: string };
    const body = req.body as RegionDto;

    console.log('Creating region:', body);
    console.log('User:', user);

    try {
      const region = await createRegion(user._id, body);
      res.status(StatusCodes.CREATED).json(region);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  },
);

/**
 * @swagger
 * /api/region/{id}:
 *   get:
 *     summary: Get a region by ID
 *     tags: [Region]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Region ID
 *     responses:
 *       200:
 *         description: The region
 *       400:
 *         description: Bad request
 *       404:
 *         description: Region not found
 */
regionRouter.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    const user = req.user as { _id: string };
    const { id } = req.params;

    try {
      const region = await getRegionById(user._id, id);
      res.status(StatusCodes.OK).json(region);
    } catch (error) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: (error as Error).message });
    }
  },
);

/**
 * @swagger
 * /api/region/{id}:
 *   patch:
 *     summary: Update a region by ID
 *     tags: [Region]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Region ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               geometry:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [Polygon]
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: array
 *                       items:
 *                         type: array
 *                         items:
 *                           type: number
 *     responses:
 *       200:
 *         description: Region updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Region not found
 */
regionRouter.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  validationBodyMiddleware(RegionDto),
  async (req: Request, res: Response) => {
    const user = req.user as { _id: string };
    const { id } = req.params;
    const body = req.body as RegionDto;

    try {
      const region = await updateRegion(user._id, id, body);
      res.status(StatusCodes.OK).json(region);
    } catch (error) {
      logger.info(error);

      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: (error as Error).message || 'Unknown error' });
    }
  },
);

/**
 * @swagger
 * /api/region/{id}:
 *   delete:
 *     summary: Delete a region by ID
 *     tags: [Region]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Region ID
 *     responses:
 *       200:
 *         description: Region deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Region not found
 */
regionRouter.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    const user = req.user as { _id: string };
    const { id } = req.params;

    try {
      await deleteRegion(user._id, id);

      res
        .status(StatusCodes.OK)
        .json({ message: 'Region deleted successfully' });
    } catch (error) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: (error as Error).message || 'Unknown error' });
    }
  },
);

/**
 * @swagger
 * /api/region:
 *   get:
 *     summary: Get a paginated list of regions
 *     tags: [Region]
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
 *         description: A list of regions
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
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: array
 *                       items:
 *                         type: number
 *       400:
 *         description: Bad request
 */
regionRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  validationQueryMiddleware(PagingDto),
  async (req: Request, res: Response) => {
    const user = req.user as { _id: string };
    const query = req.query as unknown as PagingDto;

    try {
      const regions = await getRegions(user._id, query);
      res.status(StatusCodes.OK).json(regions);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: (error as Error).message || 'Unknown error' });
    }
  },
);
