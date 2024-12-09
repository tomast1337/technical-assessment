import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import 'reflect-metadata';

export class RegionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsArray()
  @ArrayMinSize(1)
  coordinates: [number, number][][];
}
