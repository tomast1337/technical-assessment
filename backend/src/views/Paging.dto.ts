import 'reflect-metadata';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PagingDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsString()
  shortBy?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  order?: boolean;
}
