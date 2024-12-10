import { pre, Prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose'; // Import Types from mongoose
import lib from '../lib';
import { Base } from './base.model'; // Adjust the path as necessary
import { Region } from './region.model'; // Adjust the path as necessary

@pre<User>('save', async function (next) {
  const user = this as Omit<any, keyof User> & User;

  if (user.isModified('coordinates')) {
    user.address = await lib.getAddressFromCoordinates(user.coordinates);
  } else if (user.isModified('address')) {
    const { lat, lng } = await lib.getCoordinatesFromAddress(user.address);
    user.coordinates = [lng, lat];
  }

  next();
})
export class User extends Base {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, type: () => [Number] })
  coordinates: [number, number];

  @Prop({ default: [], ref: () => Region, type: () => String })
  regions: Ref<Region>[];
}
