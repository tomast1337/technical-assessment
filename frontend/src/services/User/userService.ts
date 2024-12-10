import { apiInstance } from "@hooks/useApiStore";
import type { UpdateUser } from "./types";
export const updateUser = (data: UpdateUser) => {
  apiInstance.put(`/user`, data);
};
