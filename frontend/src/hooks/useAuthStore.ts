import { create } from "zustand";
import { LoginUser, RegisterUser, UpdatePassword } from "@services/Auth/types";
import {
  loginUser,
  registerUser,
  updatePassword,
} from "@services/Auth/authService";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  login: (data: LoginUser) => Promise<void>;
  register: (data: RegisterUser) => Promise<void>;
  updatePassword: (data: UpdatePassword) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refreshToken: null,

  login: async (data: LoginUser) => {
    try {
      const { token, refreshToken } = await loginUser(data);
      set({
        token,
        refreshToken,
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  },

  register: async (data: RegisterUser) => {
    try {
      await registerUser(data);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  },

  updatePassword: async (data: UpdatePassword) => {
    try {
      await updatePassword(data);
    } catch (error) {
      console.error("Update password failed:", error);
    }
  },

  logout: () => {
    set({ token: null, refreshToken: null });
  },
}));
