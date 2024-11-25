<<<<<<< HEAD
import { Prop, Ref, index, modelOptions, pre } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import 'reflect-metadata';
=======
import 'reflect-metadata';
import { Prop, Ref, modelOptions, pre } from '@typegoose/typegoose';
import { Types } from 'mongoose';
>>>>>>> 39916c9 (Moved the backend to the backend folder)

import { User } from './user.model';

import { UserModel } from '.';

<<<<<<< HEAD
const areCoordinatesValid = (coordinates: [number, number][][]): boolean => {
  return coordinates.every((polygon) =>
    polygon.every(
      ([lng, lat]) => lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90,
    ),
  );
};

class Geometry {
  @Prop({ required: true, enum: ['Polygon'] })
  type!: string;

  @Prop({ required: true, type: [[[Number]]] })
  coordinates!: [number, number][][];
}

=======
>>>>>>> 39916c9 (Moved the backend to the backend folder)
@pre<Region>('save', async function (next) {
  const region = this as Omit<any, keyof Region> & Region;

  if (!region._id) {
    region._id = new Types.ObjectId().toString();
  }

<<<<<<< HEAD
  // ensure that the polygon is closed
  const first = region.geometry.coordinates[0][0];

  const last =
    region.geometry.coordinates[0][region.geometry.coordinates[0].length - 1];

  if (first[0] !== last[0] || first[1] !== last[1]) {
    region.geometry.coordinates[0].push(first);
  }

  // Validate coordinates
  if (!areCoordinatesValid(region.geometry.coordinates)) {
    console.error('Invalid coordinates');
    console.error(region.geometry.coordinates);
    throw new Error(
      'Invalid coordinates: Latitude must be between -90 and 90, and longitude must be between -180 and 180',
    );
  }

  if (region.isNew) {
    const session = region.$session();
    const user = await UserModel.findOne({ _id: region.user }).session(session);
    if (user) {
      user.regions.push(region._id);
      await user.save({ session });
    } else {
      throw new Error('User not found');
=======
  if (region.isNew) {
    const user = await UserModel.findOne({ _id: region.user });
    if (user) {
      user.regions.push(region._id);
      await user.save({ session: region.$session() });
>>>>>>> 39916c9 (Moved the backend to the backend folder)
    }
  }

  next(region.validateSync());
})
<<<<<<< HEAD
@index({ geometry: '2dsphere' })
@modelOptions({ schemaOptions: { validateBeforeSave: true } })
=======
@modelOptions({ schemaOptions: { validateBeforeSave: false } })
>>>>>>> 39916c9 (Moved the backend to the backend folder)
export class Region {
  @Prop({ required: true })
  name!: string;

<<<<<<< HEAD
  @Prop({ required: true, type: () => Geometry })
  geometry!: Geometry;
=======
  @Prop({ required: true })
  coordinates: [number, number][][];
>>>>>>> 39916c9 (Moved the backend to the backend folder)

  @Prop({ ref: () => User, required: true, type: () => String })
  user: Ref<User>;
}
