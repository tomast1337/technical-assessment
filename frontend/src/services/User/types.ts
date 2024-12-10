export type UpdateUser = {
  name?: string;
  address?: string;
  coordinates?: [number, number];
};

export type User = {
  id: string;
  email: string;
  name: string;
  address: string;
  coordinates: [number, number];
};
