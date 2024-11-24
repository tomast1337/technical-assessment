import { faker } from '@faker-js/faker';
import { RegionModel, UserModel } from '@models/index';
import RegionService from '@services/region.service';
import { RegionDto } from '@views/Region.dto';
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import { Types } from 'mongoose';
import * as sinon from 'sinon';

import GeoLib from '../lib';

describe('Region Service', () => {
  let session;
  let sandbox: sinon.SinonSandbox;
  const geoLibStub: Partial<typeof GeoLib> = {};

  before(async () => {
    sandbox = sinon.createSandbox();
    session = await mongoose.startSession();

    // Mock GeoLib methods
    geoLibStub.getAddressFromCoordinates = sinon
      .stub(GeoLib, 'getAddressFromCoordinates')
      .resolves(faker.location.streetAddress({ useFullAddress: true }));

    geoLibStub.getCoordinatesFromAddress = sinon
      .stub(GeoLib, 'getCoordinatesFromAddress')
      .resolves({
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
      });
  });

  after(async () => {
    sinon.restore();
    await session.endSession();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await session.startTransaction();
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
    await session.abortTransaction();
  });

  describe('createRegion', () => {
    it('should create a new region', async () => {
      const userId = new Types.ObjectId().toString();

      const createRegionDto: RegionDto = {
        name: 'Test Region',
        coordinates: [
          [
            [10, 20],
            [30, 40],
            [50, 60],
          ],
        ],
      };

      const region = await RegionService.createRegion(userId, createRegionDto);

      expect(region).to.have.property('name', createRegionDto.name);

      expect(region).to.have.property(
        'coordinates',
        createRegionDto.coordinates,
      );

      expect(region).to.have.property('user', userId);
    });
  });

  describe('getRegionById', () => {
    it('should return a region by ID', async () => {
      const userId = new Types.ObjectId().toString();

      const region = await RegionModel.create({
        name: 'Test Region',
        coordinates: [
          [
            [10, 20],
            [30, 40],
            [50, 60],
          ],
        ],
        user: userId,
      });

      const foundRegion = await RegionService.getRegionById(
        userId,
        region._id.toString(),
      );

      expect(foundRegion).to.exist;
      expect(foundRegion._id.toString()).to.equal(region._id.toString());
      expect(foundRegion.name).to.equal(region.name);
    });

    it('should throw an error if the region is not found', async () => {
      const userId = new Types.ObjectId().toString();
      const regionId = new Types.ObjectId().toString();

      try {
        await RegionService.getRegionById(userId, regionId);
      } catch (error) {
        expect(error).to.have.property(
          'message',
          'Region not found or not authorized',
        );
      }
    });
  });

  describe('updateRegion', () => {
    it('should update a region by ID', async () => {
      const userId = new Types.ObjectId().toString();

      const region = await RegionModel.create({
        name: 'Test Region',
        coordinates: [
          [
            [10, 20],
            [30, 40],
            [50, 60],
          ],
        ],
        user: userId,
      });

      const updateRegionDto: RegionDto = {
        name: 'Updated Region',
        coordinates: [
          [
            [15, 25],
            [35, 45],
            [55, 65],
          ],
        ],
      };

      const updatedRegion = await RegionService.updateRegion(
        userId,
        region._id.toString(),
        updateRegionDto,
      );

      expect(updatedRegion).to.exist;
      expect(updatedRegion._id.toString()).to.equal(region._id.toString());
      expect(updatedRegion.name).to.equal(updateRegionDto.name);
    });

    it('should throw an error if the region is not found', async () => {
      const userId = new Types.ObjectId().toString();
      const regionId = new Types.ObjectId().toString();

      const updateRegionDto: RegionDto = {
        name: 'Updated Region',
        coordinates: [
          [
            [15, 25],
            [35, 45],
            [55, 65],
          ],
        ],
      };

      try {
        await RegionService.updateRegion(userId, regionId, updateRegionDto);
      } catch (error) {
        expect(error).to.have.property(
          'message',
          'Region not found or not authorized',
        );
      }
    });
  });

  describe('deleteRegion', () => {
    it('should delete a region by ID', async () => {
      const userId = new Types.ObjectId().toString();

      const region = await RegionModel.create({
        name: 'Test Region',
        coordinates: [
          [
            [10, 20],
            [30, 40],
            [50, 60],
          ],
        ],
        user: userId,
      });

      const deletedRegion = await RegionService.deleteRegion(
        userId,
        region._id.toString(),
      );

      expect(deletedRegion).to.exist;

      expect(deletedRegion.value._id.toString()).to.equal(
        region._id.toString(),
      );
    });

    it('should throw an error if the region is not found', async () => {
      const userId = new Types.ObjectId().toString();
      const regionId = new Types.ObjectId().toString();

      try {
        await RegionService.deleteRegion(userId, regionId);
      } catch (error) {
        expect(error).to.have.property(
          'message',
          'Region not found or not authorized',
        );
      }
    });
  });

  describe('getRegions', () => {
    it('should return a list of regions for a user', async () => {
      const userId = new Types.ObjectId().toString();

      await RegionModel.insertMany([
        {
          name: 'Test Region 1',
          coordinates: [
            [
              [10, 20],
              [30, 40],
              [50, 60],
            ],
          ],
          user: userId,
        },
        {
          name: 'Test Region 2',
          coordinates: [
            [
              [15, 25],
              [35, 45],
              [55, 65],
            ],
          ],
          user: userId,
        },
      ]);

      const regions = await RegionService.getRegions(userId);

      expect(regions).to.have.lengthOf(2);
      expect(regions[0]).to.have.property('name', 'Test Region 1');
      expect(regions[1]).to.have.property('name', 'Test Region 2');
    });
  });
});
