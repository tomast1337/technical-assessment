import 'reflect-metadata';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class RegionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayMinSize(3)
  coordinates: [number, number][];
}
