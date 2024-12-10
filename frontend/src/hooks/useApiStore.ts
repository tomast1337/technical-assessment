import { refreshToken } from "@services/common/authService";
import { getCookie } from "@services/common/cookieUtilService";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE as string;

export const apiInstance = axios.create({
  baseURL: baseURL,
  timeout: 60000,
  withCredentials: true,
});

apiInstance.interceptors.request.use(
  (config) => {
    const token = getCookie("token");
    if (token) {
      // verify if the token is expired
      refreshToken();

      if (config.headers) {
        config.headers["Authorization"] = token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
