import 'reflect-metadata';
import { IsLatitude, IsLongitude, IsNotEmpty, IsNumber } from 'class-validator';

export class GeoPointDto {
  @IsNumber()
  @IsNotEmpty()
  @IsLatitude()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  @IsLongitude()
  lng: number;
}
