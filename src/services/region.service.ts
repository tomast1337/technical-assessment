import { Types } from 'mongoose';

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

  async getRegions(userId: string) {
    return await RegionModel.find({ user: userId });
  }
}

export default new RegionService();
