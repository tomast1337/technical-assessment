import { getModelForClass } from '@typegoose/typegoose';

import { Region } from './region.model';
import { User } from './user.model';

export const RegionModel = getModelForClass(Region);

export const UserModel = getModelForClass(User);
