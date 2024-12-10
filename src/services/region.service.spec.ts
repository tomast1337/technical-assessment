import { expect } from 'chai';
import { Types } from 'mongoose';
import sinon from 'sinon';

import { RegionDto } from '@app/views/Region.dto';
import { RegionModel } from '@models/index';

import RegionService from './region.service';

describe('RegionService', () => {
  let createStub: sinon.SinonStub;
  let findOneStub: sinon.SinonStub;
  let findOneAndUpdateStub: sinon.SinonStub;
  let findOneAndDeleteStub: sinon.SinonStub;
  let findStub: sinon.SinonStub;

  beforeEach(() => {
    createStub = sinon.stub(RegionModel, 'create');
    findOneStub = sinon.stub(RegionModel, 'findOne');
    findOneAndUpdateStub = sinon.stub(RegionModel, 'findOneAndUpdate');
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
        coordinates: [
          [25.774, -80.19],
          [18.466, -66.118],
          [32.321, -64.757],
        ],
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
        coordinates: [
          [25.774, -80.19],
          [18.466, -66.118],
          [32.321, -64.757],
        ],
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
          coordinates: [
            [25.774, -80.19],
            [18.466, -66.118],
            [32.321, -64.757],
          ],
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

      const result = await RegionService.getRegions('userId', {
        page: 1,
        limit: 10,
      });

      expect(result).to.deep.equal([
        { _id: 'regionId', name: 'Test Region', user: 'userId' },
      ]);

      expect(findStub.calledOnce).to.be.true;
      expect(sortStub.calledOnce).to.be.true;
      expect(skipStub.calledOnce).to.be.true;
      expect(limitStub.calledOnce).to.be.true;
    });
  });
});
