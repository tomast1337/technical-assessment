import { LoginPage } from "@app/pages/Auth/LoginPage";
import { RegisterPage } from "@app/pages/Auth/RegisterPage";
import { UpdatePasswordPage } from "@app/pages/Auth/UpdatePasswordPage";
import { Routes, Route } from "react-router-dom";

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/auth/login" element={<LoginPage />} />
    <Route path="/auth/register" element={<RegisterPage />} />
    <Route path="/auth/update-password" element={<UpdatePasswordPage />} />
  </Routes>
);
