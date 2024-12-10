import 'reflect-metadata';
import { Prop, Ref, index, modelOptions, pre } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { User } from './user.model';

import { UserModel } from '.';

class Geometry {
  @Prop({ required: true, enum: ['Polygon'] })
  type!: string;

  @Prop({ required: true, type: [[[Number]]] })
  coordinates!: [number, number][][];
}

@pre<Region>('save', async function (next) {
  const region = this as Omit<any, keyof Region> & Region;

  if (!region._id) {
    region._id = new Types.ObjectId().toString();
  }

  // ensure that the polygon is closed
  const first = region.geometry.coordinates[0][0];

  const last =
    region.geometry.coordinates[0][region.geometry.coordinates[0].length - 1];

  if (first[0] !== last[0] || first[1] !== last[1]) {
    region.geometry.coordinates[0].push(first);
  }

  if (region.isNew) {
    const session = region.$session();
    const user = await UserModel.findOne({ _id: region.user }).session(session);
    if (user) {
      user.regions.push(region._id);
      await user.save({ session });
    } else {
      throw new Error('User not found');
    }
  }

  next(region.validateSync());
})
@index({ geometry: '2dsphere' })
@modelOptions({ schemaOptions: { validateBeforeSave: true } })
export class Region {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, type: () => Geometry })
  geometry!: Geometry;

  @Prop({ ref: () => User, required: true, type: () => String })
  user: Ref<User>;
}
