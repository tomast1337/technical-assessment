import { IntlProvider } from "react-intl";
import { ReactNode, useState } from "react";
import { Locale, I18nContext, messages } from "./useI18n";

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
