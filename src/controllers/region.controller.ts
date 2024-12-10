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

const {
  getRegionsContainingPoint,
  getRegionsNearPoint,
  createRegion,
  getRegionById,
  updateRegion,
  deleteRegion,
  getRegions,
} = RegionService;

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
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: array
 *                   items:
 *                     type: number
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
    const user = req.user as { _id: string };

    try {
      const region = await createRegion(user._id, req.body);
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
 *   put:
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
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: array
 *                   items:
 *                     type: number
 *     responses:
 *       200:
 *         description: Region updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Region not found
 */
regionRouter.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  validationBodyMiddleware(RegionDto),
  async (req: Request, res: Response) => {
    const user = req.user as { _id: string };
    const { id } = req.params;

    try {
      const region = await updateRegion(user._id, id, req.body);
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
        .json({ message: (error as Error).message });
    }
  },
);

/**
 * @swagger
 * /api/region:
 *   get:
 *     summary: Get all regions for the current user
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
        .json({ message: (error as Error).message });
    }
  },
);

/**
 * @swagger
 * /api/region/containing-point:
 *   get:
 *     summary: Get regions containing a specific point
 *     tags: [Region]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         required: true
 *         description: Latitude of the point
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         required: true
 *         description: Longitude of the point
 *     responses:
 *       200:
 *         description: A list of regions containing the point
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
  '/containing-point',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send('Latitude and longitude are required');
    }

    try {
      const regions = await getRegionsContainingPoint([
        parseFloat(lat as string),
        parseFloat(lng as string),
      ]);

      res.status(StatusCodes.OK).json(regions);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send((error as Error).message);
    }
  },
);

/**
 * @swagger
 * /api/region/near-point:
 *   get:
 *     summary: Get regions near a specific point
 *     tags: [Region]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         required: true
 *         description: Latitude of the point
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         required: true
 *         description: Longitude of the point
 *       - in: query
 *         name: maxDistance
 *         schema:
 *           type: number
 *         required: true
 *         description: Maximum distance from the point
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: User ID to exclude from the search
 *     responses:
 *       200:
 *         description: A list of regions near the point
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
  '/near-point',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    const { lat, lng, maxDistance, userId } = req.query;

    if (!lat || !lng || !maxDistance) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send('Latitude, longitude, and maxDistance are required');
    }

    try {
      const regions = await getRegionsNearPoint(
        [parseFloat(lat as string), parseFloat(lng as string)],
        parseFloat(maxDistance as string),
        userId as string,
      );

      res.status(StatusCodes.OK).json(regions);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send((error as Error).message);
    }
  },
);
