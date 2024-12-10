import { AppRoutes } from "@routes/index";
import { HashRouter } from "react-router-dom";
import { I18nProvider } from "./hooks/useI18n";

export const App = () => {
  return (
    <I18nProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </I18nProvider>
  );
};
