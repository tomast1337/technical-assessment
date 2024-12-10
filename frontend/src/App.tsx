import { AppRoutes } from "@routes/index";
import { HashRouter } from "react-router-dom";
import { I18nProvider } from "./hooks/I18nProvider";

export const App = () => {
  return (
    <I18nProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </I18nProvider>
  );
};
