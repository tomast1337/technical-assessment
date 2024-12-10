import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { env } from '@config/index';
import { UserModel } from '@models/index';
import { User } from '@models/user.model';
import { LoginUserDto } from '@views/LoginUser.dto';
import { RegisterUserDto } from '@views/RegisterUser.dto';

export type JwtPayloadT = {
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
  }: RegisterUserDto) {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      address,
    });

    await newUser.save();

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
