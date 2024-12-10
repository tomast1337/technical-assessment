import { Locale, LocaleNames, useI18n } from "@app/hooks/useI18n";
import { Layout, Select } from "antd";
import { useIntl } from "react-intl";
const { Footer } = Layout;

export const AppFooter: React.FC = () => {
  const { locale, setLocale } = useI18n();
  const intl = useIntl();
  const handleChange = (value: string) => {
    setLocale(value as Locale);
  };

  return (
    <Footer style={{ textAlign: "center" }}>
      <div>
        {intl.formatMessage({ id: "footer.language" })}:{" "}
        <Select
          value={locale}
          onChange={handleChange}
          style={{ width: 120, marginBottom: 16 }}
          options={Object.keys(LocaleNames).map((key) => ({
            value: key,
            label: LocaleNames[key as Locale],
          }))}
        />
      </div>
      ©{new Date().getFullYear()} OzMapTeste.
    </Footer>
  );
};
