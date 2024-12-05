import { expect } from 'chai';
import { Types } from 'mongoose';
import sinon from 'sinon';

import { Region } from '@app/models/region.model';
import { RegionDto } from '@app/views/Region.dto';
import { RegionModel } from '@models/index';
import RegionService from '@services/region.service';

describe('RegionService', () => {
  let createStub: sinon.SinonStub;
  let findOneStub: sinon.SinonStub;
  let findOneAndUpdateStub: sinon.SinonStub;
  let countDocumentsStub: sinon.SinonStub;
  let findOneAndDeleteStub: sinon.SinonStub;
  let findStub: sinon.SinonStub;

  beforeEach(() => {
    createStub = sinon.stub(RegionModel, 'create');
    findOneStub = sinon.stub(RegionModel, 'findOne');
    findOneAndUpdateStub = sinon.stub(RegionModel, 'findOneAndUpdate');
    countDocumentsStub = sinon.stub(RegionModel, 'countDocuments');
    findOneAndDeleteStub = sinon.stub(RegionModel, 'findOneAndDelete');
    findStub = sinon.stub(RegionModel, 'find');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('createRegion', () => {
    it('should create a new region', async () => {
      const regionDto: RegionDto = {
        name: 'Test Region',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [25.774, -80.19],
              [18.466, -66.118],
              [32.321, -64.757],
              [25.774, -80.19],
            ],
          ],
        },
      };

      const id = new Types.ObjectId().toString();

      const createdRegion = { ...regionDto, user: id };
      createStub.resolves(createdRegion);

      const result = await RegionService.createRegion(id, regionDto);

      expect(result).to.deep.equal(createdRegion);
      expect(createStub.calledOnce).to.be.true;
    });
  });

  describe('getRegionById', () => {
    it('should return a region if found', async () => {
      const region = { _id: 'regionId', name: 'Test Region', user: 'userId' };
      findOneStub.resolves(region);

      const result = await RegionService.getRegionById('userId', 'regionId');

      expect(result).to.deep.equal(region);
      expect(findOneStub.calledOnce).to.be.true;
    });

    it('should throw an error if the region is not found', async () => {
      findOneStub.resolves(null);

      try {
        await RegionService.getRegionById('userId', 'regionId');
      } catch (error) {
        expect((error as any).message).to.equal(
          'Region not found or not authorized',
        );
      }

      expect(findOneStub.calledOnce).to.be.true;
    });
  });

  describe('updateRegion', () => {
    it('should update a region if found', async () => {
      const regionDto: RegionDto = {
        name: 'Updated Region',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [25.774, -80.19],
              [18.466, -66.118],
              [32.321, -64.757],
              [25.774, -80.19],
            ],
          ],
        },
      };

      const updatedRegion = { _id: 'regionId', ...regionDto, user: 'userId' };
      findOneAndUpdateStub.resolves(updatedRegion);

      const result = await RegionService.updateRegion(
        'userId',
        'regionId',
        regionDto,
      );

      expect(result).to.deep.equal(updatedRegion);
      expect(findOneAndUpdateStub.calledOnce).to.be.true;
    });

    it('should throw an error if the region is not found', async () => {
      findOneAndUpdateStub.resolves(null);

      try {
        await RegionService.updateRegion('userId', 'regionId', {
          name: 'Updated Region',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [25.774, -80.19],
                [18.466, -66.118],
                [32.321, -64.757],
                [25.774, -80.19],
              ],
            ],
          },
        });
      } catch (error) {
        expect((error as any).message).to.equal(
          'Region not found or not authorized',
        );
      }

      expect(findOneAndUpdateStub.calledOnce).to.be.true;
    });
  });

  describe('deleteRegion', () => {
    it('should delete a region if found', async () => {
      const region = { _id: 'regionId', name: 'Test Region', user: 'userId' };
      findOneAndDeleteStub.resolves(region);

      const result = await RegionService.deleteRegion('userId', 'regionId');

      expect(result).to.deep.equal(region);
      expect(findOneAndDeleteStub.calledOnce).to.be.true;
    });

    it('should throw an error if the region is not found', async () => {
      findOneAndDeleteStub.resolves(null);

      try {
        await RegionService.deleteRegion('userId', 'regionId');
      } catch (error) {
        expect((error as any).message).to.equal(
          'Region not found or not authorized',
        );
      }

      expect(findOneAndDeleteStub.calledOnce).to.be.true;
    });
  });

  describe('getRegions', () => {
    it('should return a paginated list of regions for a user', async () => {
      findStub.restore();

      const sortStub = sinon.stub().returnsThis();
      const skipStub = sinon.stub().returnsThis();

      const limitStub = sinon
        .stub()
        .resolves([{ _id: 'regionId', name: 'Test Region', user: 'userId' }]);

      findStub = sinon.stub(RegionModel, 'find').returns({
        sort: sortStub,
        skip: skipStub,
        limit: limitStub,
      } as any);

      countDocumentsStub.resolves(1);

      const result = await RegionService.getRegions('userId', {
        page: 1,
        limit: 10,
      });

      const expected = {
        data: [{ _id: 'regionId', name: 'Test Region', user: 'userId' }],
        total: 1,
        page: 1,
        limit: 10,
      };

      expect(result).to.deep.equal(expected);

      expect(findStub.calledOnce).to.be.true;
      expect(sortStub.calledOnce).to.be.true;
      expect(skipStub.calledOnce).to.be.true;
      expect(limitStub.calledOnce).to.be.true;
    });
  });

  describe('getRegionsContainingPoint', () => {
    it('should return a list of regions containing a point', async () => {
      const point = [25.774, -80.19] as [number, number];

      const regions: Partial<Region & { _id: string }>[] = [
        {
          _id: 'regionId',
          name: 'Test Region',
          user: 'userId',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [25.774, -80.19],
                [18.466, -66.118],
                [32.321, -64.757],
                [25.774, -80.19],
              ],
            ],
          },
        },
      ];

      findStub.resolves(regions);

      const result = await RegionService.getRegionsContainingPoint(point);

      expect(result).to.deep.equal(regions);
      expect(findStub.calledOnce).to.be.true;
    });
  });

  describe('getRegionsNearPoint', () => {
    it('should return a list of regions near a point', async () => {
      const point = [25.774, -80.19] as [number, number];
      const maxDistance = 1000;
      const userId = 'userId';

      const regions: Partial<Region & { _id: string }>[] = [
        {
          _id: 'regionId',
          name: 'Test Region',
          user: 'userId',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [25.774, -80.19],
                [18.466, -66.118],
                [32.321, -64.757],
                [25.774, -80.19],
              ],
            ],
          },
        },
      ];

      findStub.resolves(regions);

      const result = await RegionService.getRegionsNearPoint(
        point,
        maxDistance,
        userId,
      );

      expect(result).to.deep.equal(regions);
      expect(findStub.calledOnce).to.be.true;
    });

    it('should return a list of regions near a point excluding a user', async () => {
      const point = [25.774, -80.19] as [number, number];
      const maxDistance = 1000;
      const userId = 'userId';

      const regions: Partial<Region & { _id: string }>[] = [
        {
          _id: 'regionId',
          name: 'Test Region',
          user: 'notUserId',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [25.774, -80.19],
                [18.466, -66.118],
                [32.321, -64.757],
                [25.774, -80.19],
              ],
            ],
          },
        },
      ];

      findStub.resolves(regions);

      const result = await RegionService.getRegionsNearPoint(
        point,
        maxDistance,
        userId,
      );

      expect(result).to.deep.equal(regions);
      expect(findStub.calledOnce).to.be.true;
    });

    it('should return a list of regions near a point not filtering by user', async () => {
      const point = [25.774, -80.19] as [number, number];
      const maxDistance = 1000;

      const regions: Partial<Region & { _id: string }>[] = [
        {
          _id: 'regionId',
          name: 'Test Region',
          user: 'userId',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [25.774, -80.19],
                [18.466, -66.118],
                [32.321, -64.757],
                [25.774, -80.19],
              ],
            ],
          },
        },
      ];

      findStub.resolves(regions);

      const result = await RegionService.getRegionsNearPoint(
        point,
        maxDistance,
      );

      expect(result).to.deep.equal(regions);
      expect(findStub.calledOnce).to.be.true;
    });
  });
});
