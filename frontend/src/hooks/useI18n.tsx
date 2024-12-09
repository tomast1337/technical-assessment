import { IntlProvider } from "react-intl";
import enMessages from "../locales/en.json";
import { ReactNode, createContext, useContext, useState } from "react";
export type Locale = "en";

export const LocaleNames: Record<Locale, string> = {
  en: "English",
};
interface I18nContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const messages: Record<Locale, Record<string, string>> = {
  en: enMessages,
};

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>("en");

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      <IntlProvider locale={locale} messages={messages[locale]}>
        {children}
      </IntlProvider>
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
