import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import lib from '@app/lib';
import { env } from '@config/index';
import { UserModel } from '@models/index';
import { User } from '@models/user.model';
import { LoginUserDto } from '@views/LoginUser.dto';
import { RegisterUserDto } from '@views/RegisterUser.dto';

type JwtPayloadT = {
  id: string;
  name: string;
};

export type DecodedTokenT = jwt.JwtPayload & JwtPayloadT;
class AuthService {
  public async registerUser({
    name,
    email,
    password,
    address,
    coordinates,
  }: RegisterUserDto) {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Ensure either address or coordinates are provided, but not both
    if (address && coordinates) {
      throw new Error(
        'Either address or coordinates should be provided, not both',
      );
    }

    // If coordinates are provided, get the address from the coordinates
    if (coordinates) {
      address = await lib.getAddressFromCoordinates(coordinates);
    }

    // If address is provided, get the coordinates from the address
    if (address && !coordinates) {
      const { lat, lng } = await lib.getCoordinatesFromAddress(address);
      coordinates = [lat, lng];
    }

    // Ensure address is valid
    if (!address) {
      throw new Error('Invalid address or coordinates');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      name,
      email,
      password: hashedPassword,
      address,
      coordinates,
    });

    return { message: 'User registered successfully' };
  }

  public async loginUser({ email, password }: LoginUserDto) {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const payload: JwtPayloadT = { id: user._id, name: user.name };

    // access token
    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    // refresh token
    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    });

    return { token, refreshToken };
  }

  public async updatePassword(id: string, password: string) {
    const user = await UserModel.findOne({ _id: id });

    if (!user) {
      throw new Error('User not found');
    }

    user.password = await bcrypt.hash(password, 10);
    await UserModel.updateOne({ _id: id }, user);
    return { message: 'Password updated successfully' };
  }

  public async RefreshToken(token: string) {
    try {
      const payload = jwt.verify(
        token,
        env.JWT_REFRESH_SECRET,
      ) as DecodedTokenT;

      const user = await UserModel.findOne<User>({ _id: payload.id });

      if (!user) {
        throw new Error('User not found');
      }

      const newPayload = { id: user._id, name: user.name };

      const newToken = jwt.sign(newPayload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
      });

      const newRefreshToken = jwt.sign(newPayload, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN,
      });

      return { token: newToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

export default new AuthService();
