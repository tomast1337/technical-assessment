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
@modelOptions({ schemaOptions: { validateBeforeSave: true } })
export class Region {
  @Prop({ required: true })
  name!: string;

  // Array of coordinates eg. [[10, 20], [30, 40], [50, 60], [10, 20]]
  @Prop({ required: true, type: () => [[Number]] })
  coordinates: [number, number][];

  @Prop({ ref: () => User, required: true, type: () => String })
  user: Ref<User>;
}
