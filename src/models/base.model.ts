import 'reflect-metadata';
import { Prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import * as mongoose from 'mongoose';

import ObjectId = mongoose.Types.ObjectId;

export class Base extends TimeStamps {
  @Prop({ required: true, default: () => new ObjectId().toString() })
  _id: string;
}
