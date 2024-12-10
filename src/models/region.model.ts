import 'reflect-metadata';
import { Prop, Ref, modelOptions, pre } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { User } from './user.model';

import { UserModel } from '.';

@pre<Region>('save', async function (next) {
  const region = this as Omit<any, keyof Region> & Region;

  if (!region._id) {
    region._id = new Types.ObjectId().toString();
  }

  if (region.isNew) {
    const user = await UserModel.findOne({ _id: region.user });
    if (user) {
      user.regions.push(region._id);
      await user.save({ session: region.$session() });
    }
  }

  // the last item in the coordinates array should be the same as the first
  region.coordinates = region.coordinates.map((coordinate) => {
    if (
      coordinate[0][0] !== coordinate[coordinate.length - 1][0] ||
      coordinate[0][1] !== coordinate[coordinate.length - 1][1]
    ) {
      coordinate.push(coordinate[0]);
    }

    return coordinate;
  });

  next(region.validateSync());
})
@modelOptions({ schemaOptions: { validateBeforeSave: false } })
export class Region {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  coordinates: [number, number][][];

  @Prop({ ref: () => User, required: true, type: () => String })
  user: Ref<User>;
}
