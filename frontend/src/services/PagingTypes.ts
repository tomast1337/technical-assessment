export type PagingDto = {
  page: number;
  limit: number;
  shortBy?: string;
  order?: boolean;
};

export type PageDto<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};
