import { UserModel } from '@models/index';
import { User } from '@models/user.model';
import { PagingDto } from '../views/Paging.dto';

export const getUserById = async (user: User, userId: string) => {
  const userFound = await UserModel.findById(userId).select('-password');
  if (!userFound) {
    throw new Error('User not found');
  }
  return userFound;
};

export const updateUser = async (
  user: User,
  userId: string,
  updateData: Partial<User>,
) => {
  const userFound = await UserModel.findByIdAndUpdate(userId, updateData, {
    new: true,
  }).select('-password');
  if (!userFound) {
    throw new Error('User not found');
  }
  return userFound;
};

export const deleteUser = async (user: User, userId: string) => {
  const userFound = await UserModel.findByIdAndDelete(userId);
  if (!userFound) {
    throw new Error('User not found');
  }
  return userFound;
};

export const getUsers = async (user: User, query: PagingDto) => {
  const { page = 1, limit = 10, order, shortBy } = query;
  const sort = {};
  sort[shortBy] = order ? 1 : -1;
  const users = await UserModel.find()
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .select('-password');
  return users;
};
