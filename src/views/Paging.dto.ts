import 'reflect-metadata';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PagingDto {
  @IsInt()
  @Min(1)
  page: number;

  @IsInt()
  @Min(1)
  limit: number;

  @IsOptional()
  @IsString()
  shortBy?: string;

  @IsOptional()
  @IsBoolean()
  order?: boolean;
}
