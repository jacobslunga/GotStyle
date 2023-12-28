import { locale } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  fr: {
    foo: "como telle fous",
    bar: "chatouiller {{someValue}}",
  },
  en: {
    foo: "Foo",
    bar: "Bar {{someValue}}",
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: locale,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  cleanCode: true,
});

export default i18n;
