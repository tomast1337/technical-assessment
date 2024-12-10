import { LoginPage } from "@pages/Auth/LoginPage";
import { RegisterPage } from "@pages/Auth/RegisterPage";
import { UpdatePasswordPage } from "@pages/Auth/UpdatePasswordPage";
import { CreateRegionPage } from "@pages/Regions/CreateRegionPage";
import { RegionDetailsPage } from "@pages/Regions/RegionDetailsPage";
import { RegionsContainingPointPage } from "@pages/Regions/RegionsContainingPointPage";
import { RegionsListPage } from "@pages/Regions/RegionsListPage";
import { RegionsNearPointPage } from "@pages/Regions/RegionsNearPointPage";
import { UpdateUserPage } from "@pages/User/UpdateUserPage";
import { Route, Routes } from "react-router-dom";

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/auth/login" element={<LoginPage />} />
    <Route path="/auth/register" element={<RegisterPage />} />
    <Route path="/auth/update-password" element={<UpdatePasswordPage />} />
    <Route path="/user/update" element={<UpdateUserPage />} />

    <Route path="/regions" element={<RegionsListPage />} />
    <Route path="/regions/near-point" element={<RegionsNearPointPage />} />
    <Route path="/regions/create" element={<CreateRegionPage />} />
    <Route path="/regions/:id" element={<RegionDetailsPage />} />
    <Route
      path="/regions/containing-point"
      element={<RegionsContainingPointPage />}
    />
  </Routes>
);
