import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "./cookieUtilService";
import { LoginUser, RegisterUser, UpdatePassword } from "../Auth/types";
import { apiInstance } from "@app/hooks/useApiStore";

export const jwtDecode = (token: string) => {
  const data = JSON.parse(atob(token.split(".")[1]));

  if (!data) {
    throw new Error("Invalid token");
  }

  if (!data.email || !data.type || !data.iat || !data.exp) {
    throw new Error("Invalid token");
  }

  return {
    email: data.email,
    iat: data.iat,
    exp: data.exp,
  };
};

export const getTokenExpirationTime = (token: string): number => {
  const tokenData = jwtDecode(token);
  const expirationTime = tokenData.exp - tokenData.iat;
  const remainingTime = expirationTime - 60; // 1 minuto antes da expiração
  return remainingTime;
};

const renewSession = async (refreshToken: string) => {
  try {
    const response = await axios.post("/auth/refresh", null, {
      headers: {
        refresh_token: refreshToken,
      },
    });

    const { token, refreshToken: newRefreshToken } = response.data;
    setCookie("token", `Bearer ${token}`, getTokenExpirationTime(token));
    setCookie(
      "refresh_token",
      newRefreshToken,
      getTokenExpirationTime(newRefreshToken)
    );
  } catch (error) {
    console.error("Refresh token error:", error);
    throw error;
  }
};
export const refreshToken = async (): Promise<void> => {
  try {
    const refreshToken = getCookie("refresh_token");
    const token = getCookie("token");

    if (refreshToken && !token) {
      const refreshTokenData = jwtDecode(refreshToken);

      if (refreshTokenData.exp * 1000 < Date.now()) {
        await logout();
        return;
      }

      await renewSession(refreshToken);
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    await logout();
  }
};

export const getUserData = async () => {
  const token = getCookie("token");

  if (!token) {
    return;
  }
  const response = await apiInstance.get("/auth/me");

  return response.data;
};

export async function logout(): Promise<void> {
  localStorage.removeItem("authToken");
  const cookiesToRevoke = ["token", "refresh_token"];

  for (const cookie of cookiesToRevoke) {
    deleteCookie(cookie);
  }

  // remove all local storage items
  localStorage.clear();

  // Aguarda a exclusão dos cookies
  await new Promise((resolve) => setTimeout(resolve, 200));
}

export function hasTokens() {
  const token = getCookie("token");
  const refreshToken = getCookie("refresh_token");

  return !!token && !!refreshToken;
}

export const loginUser = async ({ email, password }: LoginUser) => {
  try {
    const response = await apiInstance.post("/auth/login", {
      email: email,
      password: password,
    });

    const { accessToken, refreshToken } = response.data;
    const accessTokenExpiration = getTokenExpirationTime(accessToken);
    const refreshTokenExpiration = getTokenExpirationTime(refreshToken);
    setCookie("token", `Bearer ${accessToken}`, accessTokenExpiration);

    setCookie("refresh_token", refreshToken, refreshTokenExpiration);

    return response.data;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};

export const registerUser = async (data: RegisterUser) => {
  try {
    const response = await apiInstance.post("/auth/register", data);

    const { accessToken, refreshToken } = response.data;
    const accessTokenExpiration = getTokenExpirationTime(accessToken);
    const refreshTokenExpiration = getTokenExpirationTime(refreshToken);
    setCookie("token", `Bearer ${accessToken}`, accessTokenExpiration);

    setCookie("refresh_token", refreshToken, refreshTokenExpiration);

    return response.data;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};

export const updatePassword = async ({ password }: UpdatePassword) => {
  try {
    await apiInstance.put("/auth/update-password", { password });
  } catch (error) {
    console.error("Update password error:", error);
    throw error;
  }
};
