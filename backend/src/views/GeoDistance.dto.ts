import 'reflect-metadata';
import {
  IsBoolean,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class GeoDistanceDto {
  @IsNumber()
  @IsNotEmpty()
  @IsLatitude()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  @IsLongitude()
  lng: number;

  @IsNumber()
  @IsNotEmpty()
  maxDistance: number;

  @IsOptional()
  @IsBoolean()
  filterUserId?: boolean;
}
