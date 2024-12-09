import { AppRoutes } from "@routes/index";
import { HashRouter } from "react-router-dom";
export const App = () => {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
};
