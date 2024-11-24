import 'reflect-metadata';
import { Prop, Ref, pre } from '@typegoose/typegoose';

import lib from '../lib';
import { Base } from './base.model';
import { Region } from './region.model';

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
