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

  next(region.validateSync());
})
@modelOptions({ schemaOptions: { validateBeforeSave: false } })
export class Region {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, type: () => [[Number]] })
  coordinates: [number, number][][];

  @Prop({ ref: () => User, required: true, type: () => String })
  user: Ref<User>;
}
