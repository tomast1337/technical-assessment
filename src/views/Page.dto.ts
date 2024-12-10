import { plainToInstance } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import 'reflect-metadata';

export class PageDto<T> {
  data: T[];

  @IsInt()
  @Min(0)
  total: number;

  @IsInt()
  @Min(1)
  page: number;

  @IsInt()
  @Min(1)
  limit: number;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
  }

  public static from<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): PageDto<T> {
    const pageData = {
      data,
      total,
      page,
      limit,
    };

    return pageData as PageDto<T>;
  }
}
