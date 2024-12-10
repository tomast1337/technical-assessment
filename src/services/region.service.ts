import { Types } from 'mongoose';

import { PageDto } from '@app/views/Page.dto';
import { PagingDto } from '@app/views/Paging.dto';
import { RegionModel } from '@models/index';
import { RegionDto } from '@views/Region.dto';

class RegionService {
  async createRegion(userId: string, createRegionDto: RegionDto) {
    const createdRegion = await RegionModel.create({
      ...createRegionDto,
      user: new Types.ObjectId(userId),
    });

    return createdRegion;
  }

  async getRegionById(userId: string, regionId: string) {
    const region = await RegionModel.findOne({ _id: regionId, user: userId });

    if (!region) {
      throw new Error('Region not found or not authorized');
    }

    return region;
  }

  async updateRegion(
    userId: string,
    regionId: string,
    updateRegionDto: RegionDto,
  ) {
    const region = await RegionModel.findOneAndUpdate(
      { _id: regionId, user: userId },
      updateRegionDto,
      { new: true },
    );

    if (!region) {
      throw new Error('Region not found or not authorized');
    }

    return region;
  }

  async deleteRegion(userId: string, regionId: string) {
    const region = await RegionModel.findOneAndDelete({
      _id: regionId,
      user: userId,
    });

    if (!region) {
      throw new Error('Region not found or not authorized');
    }

    return region;
  }

  async getRegions(userId: string, query: PagingDto) {
    const { page = 1, limit = 10, order, shortBy } = query;
    const sort = {} as any;

    if (shortBy) {
      sort[shortBy] = order ? 1 : -1;
    }

    const regions = await RegionModel.find({ user: userId })
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await RegionModel.countDocuments({ user: userId });

    return PageDto.from(regions, total, page, limit);
  }

  async getRegionsContainingPoint(point: [number, number]) {
    const regions = await RegionModel.find({
      geometry: {
        $geoIntersects: {
          $geometry: {
            type: 'Point',
            coordinates: point,
          },
        },
      },
    });

    return regions;
  }

  async getRegionsNearPoint(
    point: [number, number],
    maxDistance: number,
    userId?: string,
  ) {
    const query: any = {
      geometry: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: point,
          },
          $maxDistance: maxDistance,
        },
      },
    };

    if (userId) {
      query.user = { $ne: userId }; // Exclude the user's own regions
    }

    const regions = await RegionModel.find(query);

    return regions;
  }
}

export default new RegionService();
