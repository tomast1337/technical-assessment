export type UpdatePassword = {
  password: string;
  confirmPassword: string;
};

export type RegisterUser = {
  name: string;
  email: string;
  password: string;
  address?: string;
  coordinates?: [number, number];
};

export type LoginUser = {
  email: string;
  password: string;
};
