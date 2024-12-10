import enMessages from "../locales/en.json";
import esMessages from "../locales/es.json";
import deMessages from "../locales/de.json";
import ptMessages from "../locales/pt.json";
import ltMessages from "../locales/lt.json";
import nlMessages from "../locales/nl.json";
import { createContext, useContext } from "react";
export type Locale = "en" | "es" | "de" | "pt" | "lt" | "nl";

export const LocaleNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  de: "Deutsch",
  pt: "Português",
  lt: "Lietuvių",
  nl: "Nederlands",
};
interface I18nContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const messages: Record<Locale, Record<string, string>> = {
  en: enMessages,
  es: esMessages,
  de: deMessages,
  pt: ptMessages,
  lt: ltMessages,
  nl: nlMessages,
};

export const I18nContext = createContext<I18nContextProps | undefined>(
  undefined
);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
