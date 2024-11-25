import 'reflect-metadata';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsOptional()
  address?: string;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  coordinates?: [number, number];
}
