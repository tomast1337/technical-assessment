import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import passport from 'passport';

import { validationQueryMiddleware } from '@app/middlewares/validationMiddleware';
import { GeoDistanceDto } from '@app/views/GeoDistance.dto';
import { GeoPointDto } from '@app/views/GeoPoint.dto';
import RegionService from '@services/region.service';
import { DecodedTokenT } from '@app/services/auth.service';

const { getRegionsContainingPoint, getRegionsNearPoint } = RegionService;

export const regionActionsRouter = Router();

/**
 * @swagger
 * tags:
 *   name: RegionActions
 *   description: Region actions endpoints for getting regions information related to other regions
 */

/**
 * @swagger
 * /api/region-actions/containing-point:
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
regionActionsRouter.get(
  '/containing-point',
  passport.authenticate('jwt', { session: false }),
  validationQueryMiddleware(GeoPointDto),
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
 * /api/region-actions/near-point:
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
regionActionsRouter.get(
  '/near-point',
  passport.authenticate('jwt', { session: false }),
  validationQueryMiddleware(GeoDistanceDto),
  async (req: Request, res: Response) => {
    const { lat, lng, maxDistance, filterUserId } = req.query;

    const { id } = req.user as DecodedTokenT;

    if (!lat || !lng || !maxDistance) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send('Latitude, longitude, and maxDistance are required');
    }

    try {
      const regions = await getRegionsNearPoint(
        [parseFloat(lat as string), parseFloat(lng as string)],
        parseFloat(maxDistance as string),
        filterUserId ? id : undefined,
      );

      res.status(StatusCodes.OK).json(regions);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send((error as Error).message);
    }
  },
);
