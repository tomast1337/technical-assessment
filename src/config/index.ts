import { plainToClass } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';
import * as dotenv from 'dotenv';

dotenv.config();

export class Environment {
  @IsString()
  @IsNotEmpty()
  MONGO_URI: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRES_IN: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_EXPIRES_IN: string;

  @IsNumber()
  @IsNotEmpty()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['development', 'production', 'test'])
  NODE_ENV: 'development' | 'production' | 'test';

  @IsString()
  @IsNotEmpty()
  GOOGLE_MAPS_API_KEY: string;
}

// Transform and validate environment variables
const env = plainToClass(Environment, {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
  PORT: parseInt(process.env.PORT || '', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
});

const errors = validateSync(env, { skipMissingProperties: false });

if (errors.length > 0) {
  console.log(errors);
  throw new Error(errors.toString());
}

export { env };
